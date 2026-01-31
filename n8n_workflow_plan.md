# n8n Workflow Implementation Plan

## Overview

This plan covers 3 workflows that feed data into the Family Budget app via JSON files. Each workflow reads/writes to `public/data/` and follows the schemas defined in `n8n_monthly_budget_schema.json` and `n8n_savings_schema.json`.

---

## Workflow 1: Credit Card Report Processor

### Purpose
Parse monthly credit card PDF/CSV reports, categorize expenses, and update `monthly_budget.json`.

### Trigger
- **Type:** Manual trigger OR webhook (file upload)
- **Input:** Credit card statement file (PDF or CSV)

### Node-by-Node Plan

```
1. [Manual Trigger / Webhook]
   - Accepts file upload (PDF/CSV)
   - Stores file temporarily for processing

2. [IF Node - File Type Check]
   - Condition: file extension == .pdf OR .csv
   - True → continue
   - False → [Error Response] "סוג קובץ לא נתמך"

3. [Extract Data]
   - PDF path: Use "Extract from PDF" node (or external OCR API)
   - CSV path: Use "Spreadsheet File" node to parse CSV
   - Output: array of transactions [{date, description, amount}]

4. [AI Categorization - OpenAI/Claude Node]
   - System prompt: "You are a Hebrew expense categorizer for a family budget.
     Categorize each transaction into exactly one of these categories:
     - variable_expenses (הוצאות משתנות - groceries, restaurants, shopping, etc.)
     - extraordinary_expenses (משתנות חריגות - single items > ₪2,000)
     - energy (אנרגיה - electricity, gas, water bills)
     - insurance (ביטוחים - insurance payments)
     - vehicle (רכב - fuel, car maintenance, parking)
     - school_expenses (הוצאות בית ספר)
     - child1_activities (חוגים ילדה 1)
     - kindergarten (גן)
     - fixed_expenses (הוצאות קבועות - subscriptions, phone, internet)
     Return JSON: {category: string, amount: number} for each transaction."
   - Input: transaction list from step 3
   - Output: categorized transactions

5. [Code Node - Aggregate by Category]
   - JavaScript:
     ```javascript
     const items = $input.all();
     const totals = {};
     for (const item of items) {
       const cat = item.json.category;
       totals[cat] = (totals[cat] || 0) + item.json.amount;
     }
     // Flag extraordinary: any single item > 2000
     // Determine month from transaction dates (most common month)
     const month = determineMostCommonMonth(items); // "YYYY-MM"
     const year = parseInt(month.split('-')[0]);
     const monthHebrew = getHebrewMonth(month); // e.g., "ינו-24"

     return [{
       json: {
         month,
         year,
         month_hebrew: monthHebrew,
         expenses: totals,
         updated_at: new Date().toISOString()
       }
     }];
     ```

6. [HTTP Request - Read Current Data]
   - Method: GET
   - URL: file path or cloud storage URL for monthly_budget.json
   - Alternative: Use "Read Binary File" node if n8n has filesystem access

7. [Code Node - Merge Data]
   - JavaScript:
     ```javascript
     const existing = JSON.parse($input.first().json.data);
     const update = $('Aggregate by Category').first().json;

     const idx = existing.months.findIndex(m => m.month === update.month);
     if (idx >= 0) {
       // Merge expenses (preserve existing, override with new)
       existing.months[idx].expenses = {
         ...existing.months[idx].expenses,
         ...update.expenses
       };
       existing.months[idx].updated_at = update.updated_at;
     } else {
       // Add new month with full structure
       existing.months.push({
         month: update.month,
         year: update.year,
         month_hebrew: update.month_hebrew,
         expenses: {
           mortgage: 0, savings_investments: 0, insurance: 0,
           arnona: 0, vaad_bait: 0, energy: 0, fixed_expenses: 0,
           variable_expenses: 0, extraordinary_expenses: 0,
           vehicle: 0, school_expenses: 0, child1_activities: 0,
           kindergarten: 0,
           ...update.expenses
         },
         income: {
           one_time_income: 0, transfers_in: 0,
           salaries: 0, child_allowance: 0
         },
         notes: "",
         updated_at: update.updated_at
       });
       // Sort ascending by month
       existing.months.sort((a, b) => a.month.localeCompare(b.month));
     }

     existing.metadata.last_updated = new Date().toISOString();
     existing.metadata.source = "n8n_credit_card_processor";

     return [{ json: existing }];
     ```

8. [Write File / Upload to Cloud]
   - Write merged JSON back to monthly_budget.json
   - Options: local filesystem, Google Drive, or Dropbox

9. [Respond to Webhook / Send Notification]
   - Success: return summary {month, categories_updated, total_expenses}
   - Error: log to failed_imports.json, send email/Slack notification
```

### Validation Rules
- All amounts must be >= 0
- Month must match `YYYY-MM` pattern
- At least one expense category must have a value
- File must be valid PDF/CSV

### Hebrew Month Mapping (for Code Node)
```javascript
const hebrewMonths = {
  '01': 'ינו', '02': 'פבר', '03': 'מרץ', '04': 'אפר',
  '05': 'מאי', '06': 'יונ', '07': 'יול', '08': 'אוג',
  '09': 'ספט', '10': 'אוק', '11': 'נוב', '12': 'דצמ'
};
function getHebrewMonth(monthStr) {
  const [year, month] = monthStr.split('-');
  return `${hebrewMonths[month]}-${year.slice(2)}`;
}
```

---

## Workflow 2: Invoice Processor (Email/Upload)

### Purpose
Process individual invoices (energy, insurance, etc.) from email attachments or uploads and update the specific category in `monthly_budget.json`.

### Trigger
- **Option A:** Email Trigger (IMAP) - monitors inbox for invoices
- **Option B:** Webhook - receives uploaded invoice file

### Node-by-Node Plan

```
1. [Email Trigger (IMAP) / Webhook]
   - Email: filter by sender (electric company, insurance, etc.)
   - Webhook: accepts file upload + optional metadata

2. [IF Node - Has Attachment?]
   - Email path: check for PDF/image attachment
   - Webhook path: check file exists
   - No attachment → skip / log warning

3. [Extract Invoice Data - AI Vision Node]
   - Use OpenAI Vision or Claude to read the invoice
   - Prompt: "Extract from this Israeli invoice:
     1. Total amount (סכום לתשלום) - number only
     2. Invoice date (תאריך) - in YYYY-MM-DD format
     3. Vendor/company name
     4. Invoice description
     Return as JSON: {amount, date, vendor, description}"
   - Output: structured invoice data

4. [Code Node - Map to Category]
   - JavaScript:
     ```javascript
     const invoice = $input.first().json;
     const vendor = invoice.vendor.toLowerCase();

     // Category mapping rules
     const categoryMap = {
       'חברת חשמל': 'energy',
       'electric': 'energy',
       'עירייה': 'arnona',
       'ארנונה': 'arnona',
       'ביטוח': 'insurance',
       'הראל': 'insurance',
       'מגדל': 'insurance',
       'כלל': 'insurance',
       'דלק': 'vehicle',
       'סונול': 'vehicle',
       'פז': 'vehicle',
       'בית ספר': 'school_expenses',
       'גן': 'kindergarten',
     };

     let category = 'fixed_expenses'; // default
     for (const [keyword, cat] of Object.entries(categoryMap)) {
       if (vendor.includes(keyword) || invoice.description.includes(keyword)) {
         category = cat;
         break;
       }
     }

     const date = invoice.date; // "YYYY-MM-DD"
     const month = date.substring(0, 7); // "YYYY-MM"
     const year = parseInt(month.split('-')[0]);
     const monthHebrew = getHebrewMonth(month);

     return [{
       json: {
         month, year, month_hebrew: monthHebrew,
         category,
         amount: Math.abs(invoice.amount),
         description: invoice.description,
         updated_at: new Date().toISOString()
       }
     }];
     ```

5. [Read monthly_budget.json]
   - Same as Workflow 1, step 6

6. [Code Node - Update Single Category]
   - JavaScript:
     ```javascript
     const existing = JSON.parse($input.first().json.data);
     const update = $('Map to Category').first().json;

     const idx = existing.months.findIndex(m => m.month === update.month);
     if (idx >= 0) {
       existing.months[idx].expenses[update.category] = update.amount;
       existing.months[idx].updated_at = update.updated_at;
     } else {
       // Create new month entry
       const newMonth = {
         month: update.month,
         year: update.year,
         month_hebrew: update.month_hebrew,
         expenses: {
           mortgage: 0, savings_investments: 0, insurance: 0,
           arnona: 0, vaad_bait: 0, energy: 0, fixed_expenses: 0,
           variable_expenses: 0, extraordinary_expenses: 0,
           vehicle: 0, school_expenses: 0, child1_activities: 0,
           kindergarten: 0
         },
         income: {
           one_time_income: 0, transfers_in: 0,
           salaries: 0, child_allowance: 0
         },
         notes: "",
         updated_at: update.updated_at
       };
       newMonth.expenses[update.category] = update.amount;
       existing.months.push(newMonth);
       existing.months.sort((a, b) => a.month.localeCompare(b.month));
     }

     existing.metadata.last_updated = new Date().toISOString();
     existing.metadata.source = "n8n_invoice_processor";

     return [{ json: existing }];
     ```

7. [Write monthly_budget.json]
   - Same as Workflow 1, step 8

8. [Notification]
   - Send confirmation: "חשבונית {category} עודכנה: ₪{amount} לחודש {month_hebrew}"
```

### Vendor-to-Category Mapping (expandable)

| Vendor Keywords | Category | Hebrew |
|---|---|---|
| חברת חשמל, electric | energy | אנרגיה |
| עירייה, ארנונה | arnona | ארנונה |
| ביטוח, הראל, מגדל, כלל | insurance | ביטוחים |
| דלק, סונול, פז, רכב | vehicle | רכב |
| בית ספר | school_expenses | הוצאות בית ספר |
| גן, גנון | kindergarten | גן |
| ועד בית | vaad_bait | ועד בית |

---

## Workflow 3: Savings Account Updater

### Purpose
Update savings account balances in `savings_accounts.json` — either manually triggered or on a monthly schedule.

### Trigger
- **Option A:** Schedule Trigger (1st of each month)
- **Option B:** Manual trigger with form input
- **Option C:** Webhook from bank scraper (e.g., Israeli Bank Scraper)

### Node-by-Node Plan

```
1. [Schedule Trigger / Manual Trigger / Webhook]
   - Schedule: runs on 1st of month at 08:00
   - Manual: form with fields per account
   - Webhook: receives scraped bank data

2. [IF Node - Input Source]
   - Bank scraper path → parse API response
   - Manual path → use form data directly

3. [Code Node - Prepare Account Updates]
   - For bank scraper input:
     ```javascript
     // Map bank scraper output to our account IDs
     const accountMapping = {
       // Bank account number → our account ID
       'mizrahi_main': 'cash_mizrahi',
       'leumi_main': 'cash_leumi',
       // Add more mappings as needed
     };

     const updates = $input.all().map(item => ({
       account_id: accountMapping[item.json.accountId] || item.json.accountId,
       accumulated: item.json.balance,
       updated_at: new Date().toISOString()
     }));

     return updates.map(u => ({ json: u }));
     ```
   - For manual input:
     ```javascript
     // Form provides account_id + new accumulated value
     return [{
       json: {
         account_id: $input.first().json.account_id,
         accumulated: parseFloat($input.first().json.accumulated),
         updated_at: new Date().toISOString()
       }
     }];
     ```

4. [Read savings_accounts.json]
   - Read current file from filesystem or cloud storage

5. [Code Node - Merge Savings Data]
   - JavaScript:
     ```javascript
     const existing = JSON.parse($input.first().json.data);
     const updates = $('Prepare Account Updates').all();

     for (const update of updates) {
       const account = existing.savings_accounts.find(
         a => a.id === update.json.account_id
       );
       if (account) {
         account.accumulated = update.json.accumulated;
         account.updated_at = update.json.updated_at;
       }
       // If account not found, skip (don't create unknown accounts)
     }

     // Recalculate metadata totals
     existing.metadata.total_monthly_savings = existing.savings_accounts
       .reduce((sum, a) => sum + (a.monthly_amount || 0), 0);
     existing.metadata.total_accumulated = existing.savings_accounts
       .reduce((sum, a) => sum + (a.accumulated || 0), 0);
     existing.metadata.last_updated = new Date().toISOString();

     return [{ json: existing }];
     ```

6. [Write savings_accounts.json]
   - Write merged JSON back to file/cloud storage

7. [Notification]
   - Summary: "חסכונות עודכנו: סה״כ צבור ₪{total_accumulated}"
```

### Valid Account IDs (from current data)

| ID | Account Name | Type |
|---|---|---|
| savings_romi_analyst | חסכון לכל ילד - רומי (אנליסט) | monthly |
| savings_eli_analyst | חסכון לכל ילד - אלי (אנליסט) | monthly |
| gemel_romi_analyst | קופ"ג להשקעה רומי (אנליסט) | monthly |
| gemel_eli_analyst | קופ"ג להשקעה אלי (אנליסט) | monthly |
| gemel_parents_mor | קופ"ג להשקעה הורים (מור) | monthly |
| tria | תריא | monthly |
| kasha_gal_meitav | קה"ש גל (מיטב) | fixed |
| kasha_gal_harel | קה"ש גל (הראל) חדש | fixed |
| kasha_hadas_mor | קה"ש הדס (מור גמל ופנסיה) | fixed |
| cash_mizrahi | חשבון מזרחי (ש"ח+מט"ח) | cash |
| cash_leumi | חשבון הבינלאומי (ש"ח+ני"ע) | cash |

---

## Shared Components

### Error Handling (add to all workflows)
```
[Error Trigger Node]
  → [Code Node - Format Error]
  → [Write to failed_imports.json]
  → [Send Email / Slack Notification]
```

Error JSON structure:
```json
{
  "timestamp": "2024-01-31T14:30:00Z",
  "workflow": "credit_card_processor",
  "error": "Failed to parse PDF",
  "input_file": "jan_2024_visa.pdf",
  "details": "..."
}
```

### File Storage Strategy (MVP)
Use **Google Drive** as intermediate storage:
1. n8n reads/writes JSON files to a shared Google Drive folder
2. User downloads from Google Drive → drags into app
3. Later: automate with direct file write or webhook

### Credential Requirements
| Credential | Used By | Purpose |
|---|---|---|
| OpenAI / Anthropic API | Workflows 1, 2 | AI categorization & OCR |
| Email (IMAP) | Workflow 2 | Monitor inbox for invoices |
| Google Drive | All | File storage |
| Bank Scraper (optional) | Workflow 3 | Auto-fetch balances |

---

## Implementation Order

1. **Start with Workflow 1** (Credit Card Processor) — highest value, most data
2. **Then Workflow 3** (Savings Updater) — simplest, manual trigger
3. **Then Workflow 2** (Invoice Processor) — depends on email setup + vendor mapping tuning

## Testing Checklist

For each workflow, verify:
- [ ] Output JSON validates against the schema
- [ ] Merge with existing data preserves all fields (no data loss)
- [ ] New month entries are sorted correctly
- [ ] Hebrew month names are correct
- [ ] All amounts are non-negative
- [ ] `metadata.last_updated` is refreshed
- [ ] Error cases produce clear logs (bad file, missing fields, etc.)
- [ ] Output file can be imported into the app via drag-and-drop
