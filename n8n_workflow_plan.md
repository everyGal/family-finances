# n8n Workflow Implementation Plan

## Status: Blocked — MCP Not Connected
**Date:** 2026-01-31
**Last Validated:** 2026-01-31

---

## Prerequisites

- [ ] n8n instance running and accessible (self-hosted or cloud)
- [ ] n8n MCP server configured in Claude Code (currently **not connected** — needs setup)
- [ ] Access to Google Drive / Dropbox for file sharing (Strategy B from integration guide)
- [ ] Credit card report samples (PDF/CSV) for testing Workflow 1
- [ ] Invoice samples (PDF/image) for testing Workflow 2

---

## Workflow 1: Credit Card Report Processor

### Purpose
Parse monthly credit card statements → categorize expenses → update `monthly_budget.json`

### Trigger
Manual file upload or scheduled folder watch

### Node-by-Node Plan

| # | Node Type | Name | Description |
|---|-----------|------|-------------|
| 1 | **Manual Trigger** / **Schedule Trigger** | Trigger | Start workflow manually or on schedule |
| 2 | **Read Binary File** / **Google Drive** | Get Report | Load credit card PDF/CSV |
| 3 | **Extract from File** / **Code** | Parse Report | Extract transaction rows from CSV; for PDF use OCR or text extraction |
| 4 | **Code (JavaScript)** | Categorize Transactions | Map transactions to categories using rules: vendor name → category. Flag items >₪2,000 as `extraordinary_expenses` |
| 5 | **Code** | Calculate Totals | Sum by category. Output format: `{ month, year, month_hebrew, expenses: { variable_expenses, extraordinary_expenses, ... } }` |
| 6 | **Read Binary File** / **HTTP Request** | Load Existing Budget | Read current `monthly_budget.json` from storage |
| 7 | **Code** | Merge Data | Implement merge logic: find existing month → spread-merge expenses/income; new month → push & sort |
| 8 | **Write Binary File** / **Google Drive** | Save Budget | Write updated `monthly_budget.json` |
| 9 | **Send Email** (optional) | Notify | Send summary email on completion or error |

### Categorization Rules (Node 4)

```javascript
// Example categorization logic for the Code node
const categoryRules = [
  { pattern: /סופר|שופרסל|רמי לוי|מגה/i, category: 'variable_expenses' },
  { pattern: /דלק|פז|סונול|דור אלון/i, category: 'vehicle' },
  { pattern: /חשמל|גז|מים/i, category: 'energy' },
  { pattern: /ביטוח|הפניקס|מגדל|הראל/i, category: 'insurance' },
  // ... more rules
];

// Flag extraordinary: single transaction > ₪2,000
const EXTRAORDINARY_THRESHOLD = 2000;
```

### Merge Logic (Node 7)

```javascript
// Merge code for the Code node
const existing = JSON.parse($input.first().json.budget);
const update = $input.first().json.monthData;

const idx = existing.months.findIndex(m => m.month === update.month);
if (idx >= 0) {
  existing.months[idx].expenses = {
    ...existing.months[idx].expenses,
    ...update.expenses
  };
  if (update.income) {
    existing.months[idx].income = {
      ...existing.months[idx].income,
      ...update.income
    };
  }
  existing.months[idx].updated_at = new Date().toISOString();
} else {
  update.updated_at = new Date().toISOString();
  existing.months.push(update);
  existing.months.sort((a, b) => a.month.localeCompare(b.month));
}
existing.metadata.last_updated = new Date().toISOString();
existing.metadata.source = 'n8n_credit_card_processor';

return [{ json: existing }];
```

### Output Schema (must match `n8n_monthly_budget_schema.json`)

Required fields per month: `month` (YYYY-MM), `year` (int), `month_hebrew` (e.g. "ינו-24")

Valid expense keys:
`mortgage`, `savings_investments`, `insurance`, `arnona`, `vaad_bait`, `energy`, `fixed_expenses`, `variable_expenses`, `extraordinary_expenses`, `vehicle`, `school_expenses`, `child1_activities`, `kindergarten`

Valid income keys:
`one_time_income`, `transfers_in`, `salaries`, `child_allowance`

---

## Workflow 2: Invoice Processor

### Purpose
Process individual invoices (from email or upload) → update a single category in `monthly_budget.json`

### Trigger
Email trigger (IMAP) or manual upload

### Node-by-Node Plan

| # | Node Type | Name | Description |
|---|-----------|------|-------------|
| 1 | **Email Trigger (IMAP)** / **Manual Trigger** | Trigger | Watch inbox for invoices or manual upload |
| 2 | **Extract from File** / **HTTP Request** | OCR/Parse | Extract text from PDF/image attachment |
| 3 | **AI Agent** / **Code** | Extract Fields | Identify: amount (₪), date, vendor, description |
| 4 | **Code** | Map to Category | Determine category from vendor/description. Determine month from invoice date |
| 5 | **Read Binary File** | Load Budget | Read current `monthly_budget.json` |
| 6 | **Code** | Update Category | Find month, update single category value |
| 7 | **Write Binary File** | Save Budget | Write updated file |
| 8 | **Send Email** (optional) | Confirm | Send confirmation with extracted data |

### Category Mapping (Node 4)

```javascript
// Hebrew month helper
const hebrewMonths = {
  '01': 'ינו', '02': 'פבר', '03': 'מרץ', '04': 'אפר',
  '05': 'מאי', '06': 'יונ', '07': 'יול', '08': 'אוג',
  '09': 'ספט', '10': 'אוק', '11': 'נוב', '12': 'דצמ'
};

function getMonthHebrew(dateStr) {
  const [year, month] = dateStr.split('-');
  return `${hebrewMonths[month]}-${year.slice(2)}`;
}

// Vendor → category mapping
const vendorCategories = {
  'חברת החשמל': 'energy',
  'עיריית': 'arnona',
  'ביטוח': 'insurance',
  // ... extend as needed
};
```

### Output per invoice

```json
{
  "month": "2024-01",
  "category": "energy",
  "amount": 450,
  "description": "חשבון חשמל ינואר",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

## Workflow 3: Savings Account Updater

### Purpose
Update savings account balances in `savings_accounts.json`

### Trigger
Monthly schedule or manual trigger

### Node-by-Node Plan

| # | Node Type | Name | Description |
|---|-----------|------|-------------|
| 1 | **Schedule Trigger** / **Manual Trigger** | Trigger | Monthly (1st of month) or manual |
| 2 | **Form** / **Code** | Input Balances | Manual form input for each account, or bank API if available |
| 3 | **Read Binary File** | Load Savings | Read current `savings_accounts.json` |
| 4 | **Code** | Update Accounts | Match by `id`, update `accumulated` and `updated_at` |
| 5 | **Code** | Recalculate Totals | Update `metadata.total_monthly_savings` and `metadata.total_accumulated` |
| 6 | **Write Binary File** | Save Savings | Write updated file |

### Update Logic (Node 4)

```javascript
const existing = JSON.parse($input.first().json.savings);
const updates = $input.first().json.accountUpdates; // [{id, accumulated}]

for (const upd of updates) {
  const acct = existing.savings_accounts.find(a => a.id === upd.id);
  if (acct) {
    acct.accumulated = upd.accumulated;
    acct.updated_at = new Date().toISOString();
  }
}

// Recalculate totals
existing.metadata.total_monthly_savings = existing.savings_accounts
  .reduce((sum, a) => sum + (a.monthly_amount || 0), 0);
existing.metadata.total_accumulated = existing.savings_accounts
  .reduce((sum, a) => sum + (a.accumulated || 0), 0);
existing.metadata.last_updated = new Date().toISOString();

return [{ json: existing }];
```

### Known Account IDs (from current data)

| ID | Account Name | Type | Owner |
|----|-------------|------|-------|
| `savings_romi_analyst` | חסכון לכל ילד - רומי | monthly | הדס |
| `savings_eli_analyst` | חסכון לכל ילד - אלי | monthly | הדס |
| `gemel_romi_analyst` | קופ"ג להשקעה רומי | monthly | גל |
| `gemel_eli_analyst` | קופ"ג להשקעה אלי | monthly | גל |
| `gemel_parents_mor` | קופ"ג להשקעה הורים | monthly | גל |
| `tria` | תריא | monthly | shared |
| `kasha_gal_meitav` | קה"ש גל (מיטב) | fixed | גל |
| `kasha_gal_harel` | קה"ש גל (הראל) חדש | fixed | גל |
| `kasha_hadas_mor` | קה"ש הדס (מור) | fixed | הדס |
| `cash_mizrahi` | חשבון מזרחי | cash | shared |
| `cash_leumi` | חשבון הבינלאומי | cash | shared |

---

## Validation Rules (All Workflows)

All workflows must validate before writing:

1. **Amounts**: `typeof val === 'number' && val >= 0`
2. **Month format**: regex `^\d{4}-\d{2}$`
3. **Required fields**: `month`, `year`, `month_hebrew` for budget updates
4. **Category keys**: must be one of the known category IDs from `categories.json`
5. **Account IDs**: must match existing account in `savings_accounts.json`
6. **Dates**: valid ISO 8601 format for `updated_at`

### Error Handling Pattern (add to each workflow)

```
[Any Node] → on error → [Code: Log Error] → [Write: failed_imports.json] → [Send Email: Error Notification]
```

---

## Delivery Strategy: Strategy B (Manual Import)

Per the integration guide MVP recommendation:

1. n8n writes output JSON to **Google Drive shared folder**
2. User downloads the file
3. User drags/drops into the app's import UI
4. App validates and merges

This avoids needing direct filesystem access or a backend API.

---

## Implementation Order

| Phase | Task | Priority |
|-------|------|----------|
| **1** | Set up n8n MCP connection in Claude Code | Blocker |
| **2** | Build Workflow 1 (Credit Card Processor) — most impactful | High |
| **3** | Build Workflow 3 (Savings Updater) — simplest | Medium |
| **4** | Build Workflow 2 (Invoice Processor) — needs OCR/AI | Medium |
| **5** | Add error handling + notifications to all workflows | Medium |
| **6** | Test with real data samples | High |
| **7** | Set up Google Drive integration for file sharing | Low |

---

## MCP Validation Log

| Date | Result | Details |
|------|--------|---------|
| 2026-01-31 | **NOT AVAILABLE** | `.mcp.json` not present (gitignored). No n8n MCP server configured. Phase 1 blocker remains. |

## Next Steps

1. **Set up n8n instance** — deploy self-hosted or create n8n cloud account
2. **Create `.mcp.json`** — add n8n server URL and bearer token to project root (file is gitignored)
3. **Restart Claude Code** — MCP servers are loaded at startup
4. **Re-validate** — run this validation again to confirm connectivity
5. Once MCP is connected, create Workflow 1 using the n8n API
6. Test with sample credit card data
