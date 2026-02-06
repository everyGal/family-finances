# n8n Workflow Development Plan — Family Budget Application

## Overview

Build 3 n8n workflows that automate family budget data processing. All workflows output JSON files conforming to the app's existing schemas (`n8n_monthly_budget_schema.json`, `n8n_savings_schema.json`) and are designed for **Strategy B (Manual Import)** — n8n generates output, user imports via drag-and-drop into the React app.

**n8n Instance:** Workflow `mlkvB24WhurFYR1H`
**Development Method:** All workflow creation, editing, testing, and validation done via **n8n MCP tools** — no local n8n development.
**AI for Document Parsing:** Gemini Flash 3 via HTTP Request node with structured JSON output.

---

## Development Environment

### n8n MCP Tools Available

| Tool | Purpose |
|------|---------|
| `n8n_search_nodes` | Find available node types (e.g., `nodes-base.httpRequest`) |
| `n8n_search_node_parameters` | Get parameter schema for a node type |
| `n8n_create_workflow` | Create a new workflow from JSON definition |
| `n8n_edit_workflow` | Update an existing workflow |
| `n8n_validate_workflow` | Validate workflow structure and node configs |
| `n8n_list_workflows` | List all workflows on the instance |
| `n8n_get_workflow` | Retrieve a workflow by ID |

### Key n8n Conventions (from skills)

- **Code node return format:** Always `[{ json: { ... } }]`
- **Webhook data:** Access via `$json.body.fieldName`
- **Expression syntax:** `{{ }}` in node parameter fields; plain JS in Code nodes
- **nodeType format:** `n8n-nodes-base.` prefix in workflow definitions; `nodes-base.` prefix for search/validate tools

### Gemini Flash 3 Integration

All document parsing (receipts, invoices, credit card PDFs) uses **Google Gemini Flash 3** via the HTTP Request node:

- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Auth:** API key as query parameter `?key={{$env.GEMINI_API_KEY}}`
- **Method:** POST
- **Content-Type:** `application/json`
- **Why Gemini Flash 3:** Fast, cheap, excellent at Hebrew OCR and structured extraction, supports PDF/image input natively via base64

---

## Workflow 1: Credit Card Report Processor

### Purpose
Parse monthly credit card statement (PDF/CSV) → categorize transactions → output `monthly_budget.json` update for app import.

### Trigger
Manual Trigger (user uploads file to n8n)

### Node Flow

```
[1: Manual Trigger]
  → [2: Read Binary File / Set node with base64]
  → [3: HTTP Request — Gemini Flash 3 (extract transactions)]
  → [4: Code — Parse Gemini response & categorize]
  → [5: Code — Calculate category totals & build month object]
  → [6: Code — Build final monthly_budget.json output]
  → [7: Write Binary File / Download (output JSON for user)]
  → [8: Send Email (optional — summary notification)]
```

### Node Details

#### Node 1: Manual Trigger
- Type: `n8n-nodes-base.manualTrigger`
- Followed by a file read or Set node where user provides the credit card PDF

#### Node 2: Read Binary File
- Type: `n8n-nodes-base.readBinaryFile`
- Reads credit card PDF from a configured path
- Alternative: Use a Set node with base64-encoded content if file is provided externally

#### Node 3: HTTP Request — Gemini Flash 3
- Type: `n8n-nodes-base.httpRequest`
- Method: `POST`
- URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={{$env.GEMINI_API_KEY}}`
- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "contents": [
    {
      "parts": [
        {
          "inline_data": {
            "mime_type": "application/pdf",
            "data": "={{ $binary.data.toBase64() }}"
          }
        },
        {
          "text": "Extract all transactions from this Israeli credit card statement. For each transaction return: date (YYYY-MM-DD), description (original Hebrew), amount (number in ILS, positive), vendor_name (Hebrew). Return ONLY valid JSON array, no markdown. Example: [{\"date\":\"2024-01-05\",\"description\":\"שופרסל דיל\",\"amount\":450.50,\"vendor_name\":\"שופרסל\"}]"
        }
      ]
    }
  ],
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "date": { "type": "STRING" },
          "description": { "type": "STRING" },
          "amount": { "type": "NUMBER" },
          "vendor_name": { "type": "STRING" }
        },
        "required": ["date", "description", "amount", "vendor_name"]
      }
    }
  }
}
```

**Structured Output:** Gemini's `responseSchema` enforces the exact JSON shape — no regex parsing needed.

#### Node 4: Code — Categorize Transactions
- Type: `n8n-nodes-base.code`
- Language: JavaScript

```javascript
// Categorization rules — vendor patterns → budget category
const categoryRules = [
  // Supermarkets & groceries → variable_expenses
  { pattern: /סופר|שופרסל|רמי לוי|מגה|יוחננוף|אושר עד|חצי חינם|ויקטורי/i, category: 'variable_expenses' },
  // Fuel & vehicle
  { pattern: /דלק|פז|סונול|דור אלון|yellow|טסט|מוסך/i, category: 'vehicle' },
  // Energy & utilities
  { pattern: /חשמל|גז|מים|עין נטפים|חברת החשמל/i, category: 'energy' },
  // Insurance
  { pattern: /ביטוח|הפניקס|מגדל|הראל|כלל|מנורה/i, category: 'insurance' },
  // Municipal tax
  { pattern: /ארנונה|עירייה|עיריית/i, category: 'arnona' },
  // School
  { pattern: /בית ספר|ביה"ס|אסכולה|הורים|תשלומים לביה/i, category: 'school_expenses' },
  // Activities
  { pattern: /חוג|שחייה|ג'ודו|בלט|מוזיקה|ספורט/i, category: 'child1_activities' },
  // Kindergarten
  { pattern: /גן|גנון|צהרון|משפחתון/i, category: 'kindergarten' },
  // Building committee
  { pattern: /ועד בית/i, category: 'vaad_bait' },
];

const EXTRAORDINARY_THRESHOLD = 2000;
const transactions = JSON.parse($input.first().json.candidates[0].content.parts[0].text);

const categorized = transactions.map(tx => {
  let category = 'variable_expenses'; // default
  for (const rule of categoryRules) {
    if (rule.pattern.test(tx.vendor_name) || rule.pattern.test(tx.description)) {
      category = rule.category;
      break;
    }
  }
  // Flag extraordinary single transactions
  if (tx.amount >= EXTRAORDINARY_THRESHOLD && category === 'variable_expenses') {
    category = 'extraordinary_expenses';
  }
  return { ...tx, category };
});

return [{ json: { categorized, raw_count: transactions.length } }];
```

#### Node 5: Code — Calculate Totals
- Type: `n8n-nodes-base.code`

```javascript
const { categorized } = $input.first().json;

// Determine month from first transaction date
const firstDate = categorized[0]?.date || '';
const [year, month] = firstDate.split('-');

const hebrewMonths = {
  '01': 'ינו', '02': 'פבר', '03': 'מרץ', '04': 'אפר',
  '05': 'מאי', '06': 'יונ', '07': 'יול', '08': 'אוג',
  '09': 'ספט', '10': 'אוק', '11': 'נוב', '12': 'דצמ'
};

// Sum amounts by category
const totals = {};
for (const tx of categorized) {
  totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
}

// Round all values
for (const key of Object.keys(totals)) {
  totals[key] = Math.round(totals[key]);
}

const monthData = {
  month: `${year}-${month}`,
  year: parseInt(year),
  month_hebrew: `${hebrewMonths[month]}-${year.slice(2)}`,
  expenses: totals,
  updated_at: new Date().toISOString()
};

return [{ json: { monthData } }];
```

#### Node 6: Code — Build Output JSON
- Type: `n8n-nodes-base.code`

```javascript
const { monthData } = $input.first().json;

const output = {
  months: [monthData],
  metadata: {
    last_updated: new Date().toISOString(),
    source: 'n8n_credit_card_processor',
    version: '1.0'
  }
};

return [{ json: output }];
```

This output is a valid `monthly_budget.json` fragment. The React app's import merge logic will handle inserting/updating the month.

#### Node 7: Write Binary File / Download
- Converts JSON to downloadable file
- Filename pattern: `budget_update_YYYY-MM.json`

#### Node 8: Send Email (Optional)
- Summary of processed transactions
- Category breakdown
- Flagged extraordinary expenses

### Categorization Rules Reference

| Pattern (Hebrew) | Budget Category | Notes |
|---|---|---|
| סופר, שופרסל, רמי לוי, מגה | `variable_expenses` | Grocery stores |
| דלק, פז, סונול, מוסך | `vehicle` | Fuel & garage |
| חשמל, גז, מים | `energy` | Utilities |
| ביטוח, הפניקס, מגדל, הראל | `insurance` | Insurance companies |
| ארנונה, עירייה | `arnona` | Municipal tax |
| בית ספר | `school_expenses` | School fees |
| חוג, שחייה, בלט | `child1_activities` | Kids activities |
| גן, צהרון | `kindergarten` | Kindergarten |
| ועד בית | `vaad_bait` | Building committee |
| Single tx >= ₪2,000 | `extraordinary_expenses` | Flagged automatically |
| Everything else | `variable_expenses` | Default category |

---

## Workflow 2: Invoice/Receipt Processor

### Purpose
Process individual invoices or receipts (PDF/image) → extract amount, date, vendor → determine category → output a single-category budget update JSON.

### Trigger
Manual Trigger (user provides invoice file)

### Node Flow

```
[1: Manual Trigger]
  → [2: Read Binary File]
  → [3: HTTP Request — Gemini Flash 3 (extract invoice fields)]
  → [4: Code — Map vendor to category & build update]
  → [5: Code — Build output JSON]
  → [6: Write Binary File (output JSON)]
  → [7: Send Email (optional confirmation)]
```

### Node Details

#### Node 3: HTTP Request — Gemini Flash 3 (Invoice Extraction)
- Same endpoint as Workflow 1
- Different prompt and structured output schema:

```json
{
  "contents": [
    {
      "parts": [
        {
          "inline_data": {
            "mime_type": "={{ $binary.data.mimeType }}",
            "data": "={{ $binary.data.toBase64() }}"
          }
        },
        {
          "text": "Extract from this Israeli invoice/receipt: the total amount in ILS, the invoice date, the vendor/company name, and a brief description. All text is Hebrew."
        }
      ]
    }
  ],
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "OBJECT",
      "properties": {
        "amount": { "type": "NUMBER", "description": "Total amount in ILS" },
        "date": { "type": "STRING", "description": "Invoice date YYYY-MM-DD" },
        "vendor_name": { "type": "STRING", "description": "Vendor/company name in Hebrew" },
        "description": { "type": "STRING", "description": "Brief description of the invoice" }
      },
      "required": ["amount", "date", "vendor_name"]
    }
  }
}
```

#### Node 4: Code — Map to Category

```javascript
const invoice = JSON.parse($input.first().json.candidates[0].content.parts[0].text);

const vendorCategoryMap = [
  { pattern: /חברת החשמל|חשמל/i, category: 'energy' },
  { pattern: /גז|סופרגז/i, category: 'energy' },
  { pattern: /מים|מקורות|עין נטפים/i, category: 'energy' },
  { pattern: /עירייה|ארנונה/i, category: 'arnona' },
  { pattern: /ביטוח|הפניקס|מגדל|הראל|כלל/i, category: 'insurance' },
  { pattern: /ועד בית/i, category: 'vaad_bait' },
  { pattern: /בית ספר|משרד החינוך/i, category: 'school_expenses' },
  { pattern: /גן|צהרון|גנון/i, category: 'kindergarten' },
  { pattern: /דלק|רכב|טסט|מוסך/i, category: 'vehicle' },
  { pattern: /חוג|שחייה|ספורט/i, category: 'child1_activities' },
];

let category = 'fixed_expenses'; // default for invoices
for (const rule of vendorCategoryMap) {
  if (rule.pattern.test(invoice.vendor_name) || rule.pattern.test(invoice.description || '')) {
    category = rule.category;
    break;
  }
}

const [year, month] = invoice.date.split('-');
const hebrewMonths = {
  '01': 'ינו', '02': 'פבר', '03': 'מרץ', '04': 'אפר',
  '05': 'מאי', '06': 'יונ', '07': 'יול', '08': 'אוג',
  '09': 'ספט', '10': 'אוק', '11': 'נוב', '12': 'דצמ'
};

return [{
  json: {
    month: `${year}-${month}`,
    year: parseInt(year),
    month_hebrew: `${hebrewMonths[month]}-${year.slice(2)}`,
    category,
    amount: Math.round(invoice.amount),
    vendor_name: invoice.vendor_name,
    description: invoice.description || ''
  }
}];
```

#### Node 5: Code — Build Output JSON

```javascript
const data = $input.first().json;

const output = {
  months: [
    {
      month: data.month,
      year: data.year,
      month_hebrew: data.month_hebrew,
      expenses: {
        [data.category]: data.amount
      },
      notes: `${data.vendor_name}: ${data.description}`,
      updated_at: new Date().toISOString()
    }
  ],
  metadata: {
    last_updated: new Date().toISOString(),
    source: 'n8n_invoice_processor',
    version: '1.0'
  }
};

return [{ json: output }];
```

The app's import merge logic will spread-merge `expenses`, preserving all other category values for that month.

---

## Workflow 3: Savings Account Updater

### Purpose
Update savings account balances in `savings_accounts.json`. Manual input via n8n form or bulk update.

### Trigger
Manual Trigger (monthly task)

### Node Flow

```
[1: Manual Trigger]
  → [2: Code — Define account updates (manual input)]
  → [3: Code — Build updated savings_accounts.json]
  → [4: Write Binary File (output JSON)]
```

### Node Details

#### Node 2: Code — Account Updates Input

```javascript
// Manual input: update these values each month
// Edit this array with current balances before running
const accountUpdates = [
  { id: 'savings_romi_analyst', accumulated: 18121 },
  { id: 'savings_eli_analyst', accumulated: 5425 },
  { id: 'gemel_romi_analyst', accumulated: 37226 },
  { id: 'gemel_eli_analyst', accumulated: 7513 },
  { id: 'gemel_parents_mor', accumulated: 81596 },
  { id: 'tria', accumulated: 1027 },
  { id: 'kasha_gal_meitav', accumulated: 10000 },
  { id: 'kasha_gal_harel', accumulated: 15000 },
  { id: 'kasha_hadas_mor', accumulated: 10000 },
  { id: 'cash_mizrahi', accumulated: 50000 },
  { id: 'cash_leumi', accumulated: 50000 },
];

return [{ json: { accountUpdates } }];
```

#### Node 3: Code — Build Savings JSON

```javascript
const { accountUpdates } = $input.first().json;

// Base account definitions (structure from savings_accounts.json)
const baseAccounts = [
  { id: 'savings_romi_analyst', account_name: 'חסכון לכל ילד - רומי (אנליסט)', account_type: 'monthly', owner: 'הדס', monthly_amount: 102, yearly_amount: 1224, sort_order: 1 },
  { id: 'savings_eli_analyst', account_name: 'חסכון לכל ילד - אלי (אנליסט)', account_type: 'monthly', owner: 'הדס', monthly_amount: 102, yearly_amount: 1224, sort_order: 2 },
  { id: 'gemel_romi_analyst', account_name: 'קופ"ג להשקעה רומי (אנליסט)', account_type: 'monthly', owner: 'גל', monthly_amount: 300, yearly_amount: 3600, sort_order: 3 },
  { id: 'gemel_eli_analyst', account_name: 'קופ"ג להשקעה אלי (אנליסט)', account_type: 'monthly', owner: 'גל', monthly_amount: 300, yearly_amount: 3600, sort_order: 4 },
  { id: 'gemel_parents_mor', account_name: 'קופ"ג להשקעה הורים (מור)', account_type: 'monthly', owner: 'גל', monthly_amount: 1500, yearly_amount: 18000, sort_order: 5 },
  { id: 'tria', account_name: 'תריא', account_type: 'monthly', owner: 'shared', monthly_amount: 0, yearly_amount: 0, sort_order: 6 },
  { id: 'kasha_gal_meitav', account_name: 'קה"ש גל (מיטב)', account_type: 'fixed', owner: 'גל', monthly_amount: 0, yearly_amount: 0, sort_order: 7 },
  { id: 'kasha_gal_harel', account_name: 'קה"ש גל (הראל) חדש', account_type: 'fixed', owner: 'גל', monthly_amount: 0, yearly_amount: 0, sort_order: 8 },
  { id: 'kasha_hadas_mor', account_name: 'קה"ש הדס (מור גמל ופנסיה)', account_type: 'fixed', owner: 'הדס', monthly_amount: 0, yearly_amount: 0, sort_order: 9 },
  { id: 'cash_mizrahi', account_name: 'חשבון מזרחי (ש"ח+מט"ח)', account_type: 'cash', owner: 'shared', monthly_amount: 0, yearly_amount: 0, sort_order: 10 },
  { id: 'cash_leumi', account_name: 'חשבון הבינלאומי (ש"ח+ני"ע)', account_type: 'cash', owner: 'shared', monthly_amount: 0, yearly_amount: 0, sort_order: 11 },
];

const now = new Date().toISOString();
const updatedAccounts = baseAccounts.map(acct => {
  const update = accountUpdates.find(u => u.id === acct.id);
  return {
    ...acct,
    accumulated: update ? update.accumulated : 0,
    notes: '',
    updated_at: now
  };
});

const totalMonthly = updatedAccounts.reduce((sum, a) => sum + (a.monthly_amount || 0), 0);
const totalAccumulated = updatedAccounts.reduce((sum, a) => sum + (a.accumulated || 0), 0);

const output = {
  savings_accounts: updatedAccounts,
  metadata: {
    last_updated: now,
    total_monthly_savings: totalMonthly,
    total_accumulated: totalAccumulated
  }
};

return [{ json: output }];
```

---

## Gemini Flash 3 — HTTP Request Configuration Reference

This section documents the exact HTTP Request node configuration for reuse across workflows.

### Environment Variable Required

Set in n8n environment: `GEMINI_API_KEY` — your Google AI API key.

### Base HTTP Request Node Config

| Parameter | Value |
|-----------|-------|
| Method | `POST` |
| URL | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={{$env.GEMINI_API_KEY}}` |
| Authentication | None (key in URL) |
| Content-Type | `application/json` |
| Response Format | JSON |

### Sending PDF/Image to Gemini

Binary data must be base64-encoded in the `inline_data.data` field:

```json
{
  "inline_data": {
    "mime_type": "application/pdf",
    "data": "={{ $binary.data.toBase64() }}"
  }
}
```

Supported mime types: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`

### Structured Output (responseSchema)

Gemini Flash 3 supports `responseMimeType: "application/json"` with a `responseSchema` that forces the model to return valid JSON matching the schema. This eliminates the need for regex-based parsing:

```json
{
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "OBJECT",
      "properties": {
        "field1": { "type": "STRING" },
        "field2": { "type": "NUMBER" }
      },
      "required": ["field1", "field2"]
    }
  }
}
```

### Parsing Gemini Response in Code Node

The response structure from Gemini is:
```
response.candidates[0].content.parts[0].text  →  JSON string
```

In a Code node:
```javascript
const geminiResponse = $input.first().json;
const parsed = JSON.parse(geminiResponse.candidates[0].content.parts[0].text);
```

### Error Handling for Gemini

Add an IF node after the HTTP Request to check:
```
{{ $json.candidates && $json.candidates.length > 0 }}
```

If false, route to error handling (log + notification).

---

## Output Schemas (Must Match App Expectations)

### monthly_budget.json Output

Workflows 1 & 2 output this format. The React app merge logic handles partial updates:

```json
{
  "months": [
    {
      "month": "2024-01",
      "year": 2024,
      "month_hebrew": "ינו-24",
      "expenses": {
        "variable_expenses": 5000,
        "extraordinary_expenses": 0
      },
      "income": {},
      "notes": "",
      "updated_at": "2024-01-31T14:30:00Z"
    }
  ],
  "metadata": {
    "last_updated": "2024-01-31T14:30:00Z",
    "source": "n8n_credit_card_processor",
    "version": "1.0"
  }
}
```

**Valid expense keys:** `mortgage`, `savings_investments`, `insurance`, `arnona`, `vaad_bait`, `energy`, `fixed_expenses`, `variable_expenses`, `extraordinary_expenses`, `vehicle`, `school_expenses`, `child1_activities`, `kindergarten`

**Valid income keys:** `one_time_income`, `transfers_in`, `salaries`, `child_allowance`

### savings_accounts.json Output

Workflow 3 outputs the complete file (full replacement, not partial merge):

```json
{
  "savings_accounts": [
    {
      "id": "savings_romi_analyst",
      "account_name": "חסכון לכל ילד - רומי (אנליסט)",
      "account_type": "monthly",
      "owner": "הדס",
      "monthly_amount": 102,
      "yearly_amount": 1224,
      "accumulated": 18500,
      "notes": "",
      "sort_order": 1,
      "updated_at": "2024-02-01T00:00:00Z"
    }
  ],
  "metadata": {
    "last_updated": "2024-02-01T00:00:00Z",
    "total_monthly_savings": 2304,
    "total_accumulated": 286000
  }
}
```

---

## Validation Rules (All Workflows)

Before writing output, every workflow must validate:

| Rule | Check | Action on Failure |
|------|-------|-------------------|
| Amounts non-negative | `typeof val === 'number' && val >= 0` | Set to 0, log warning |
| Month format | `/^\d{4}-\d{2}$/` | Abort, notify |
| Required fields | `month`, `year`, `month_hebrew` present | Abort, notify |
| Category keys valid | Must be in known list (see above) | Map to `variable_expenses`, log |
| Account IDs valid | Must match known account IDs | Skip, log warning |
| Dates ISO 8601 | `updated_at` is valid date string | Set to `new Date().toISOString()` |

### Validation Code Template (reuse in each workflow)

```javascript
const VALID_EXPENSE_KEYS = [
  'mortgage', 'savings_investments', 'insurance', 'arnona',
  'vaad_bait', 'energy', 'fixed_expenses', 'variable_expenses',
  'extraordinary_expenses', 'vehicle', 'school_expenses',
  'child1_activities', 'kindergarten'
];
const VALID_INCOME_KEYS = [
  'one_time_income', 'transfers_in', 'salaries', 'child_allowance'
];

function validateMonthData(data) {
  const errors = [];

  if (!/^\d{4}-\d{2}$/.test(data.month)) {
    errors.push(`Invalid month format: ${data.month}`);
  }
  if (typeof data.year !== 'number') {
    errors.push(`Year must be a number: ${data.year}`);
  }
  if (!data.month_hebrew) {
    errors.push('Missing month_hebrew');
  }

  if (data.expenses) {
    for (const [key, val] of Object.entries(data.expenses)) {
      if (!VALID_EXPENSE_KEYS.includes(key)) {
        errors.push(`Unknown expense key: ${key}`);
      }
      if (typeof val !== 'number' || val < 0) {
        errors.push(`Invalid amount for ${key}: ${val}`);
      }
    }
  }

  if (data.income) {
    for (const [key, val] of Object.entries(data.income)) {
      if (!VALID_INCOME_KEYS.includes(key)) {
        errors.push(`Unknown income key: ${key}`);
      }
      if (typeof val !== 'number' || val < 0) {
        errors.push(`Invalid amount for ${key}: ${val}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
```

---

## Error Handling Pattern

Each workflow should include error handling:

```
[Any Node] → on error → [Code: Format Error] → [Send Email: Error Alert]
```

Error notification includes:
- Workflow name
- Failed node name
- Error message
- Input data that caused the failure
- Timestamp

### Error Code Node Template

```javascript
const error = $input.first().json;
return [{
  json: {
    workflow: 'Credit Card Processor',
    node: error.$node || 'unknown',
    message: error.message || JSON.stringify(error),
    timestamp: new Date().toISOString(),
    suggestion: 'Check input file format and Gemini API key'
  }
}];
```

---

## Implementation Order & Phases

### Phase 1: Prerequisites & Setup
- [ ] Verify n8n MCP connection works (list workflows via `n8n_list_workflows`)
- [ ] Verify `GEMINI_API_KEY` environment variable is set in n8n
- [ ] Test Gemini Flash 3 endpoint with a simple HTTP Request node
- [ ] Prepare sample credit card PDF for testing

### Phase 2: Workflow 1 — Credit Card Processor (Priority: High)
- [ ] Search for required node types via `n8n_search_nodes`
- [ ] Create workflow skeleton via `n8n_create_workflow`
- [ ] Add Manual Trigger + Read Binary File nodes
- [ ] Add HTTP Request node for Gemini (with structured output)
- [ ] Add categorization Code node
- [ ] Add totals calculation Code node
- [ ] Add output builder Code node
- [ ] Add Write Binary File for download
- [ ] Validate workflow via `n8n_validate_workflow`
- [ ] Test with sample credit card statement
- [ ] Verify output matches `n8n_monthly_budget_schema.json`

### Phase 3: Workflow 2 — Invoice/Receipt Processor (Priority: Medium)
- [ ] Create workflow via `n8n_create_workflow`
- [ ] Configure Gemini HTTP Request for invoice extraction
- [ ] Add vendor-to-category mapping Code node
- [ ] Add output builder Code node
- [ ] Validate and test with sample invoices
- [ ] Verify output merges correctly in the React app

### Phase 4: Workflow 3 — Savings Updater (Priority: Medium)
- [ ] Create workflow via `n8n_create_workflow`
- [ ] Add manual input Code node with all 11 account IDs
- [ ] Add savings JSON builder Code node
- [ ] Validate output matches `n8n_savings_schema.json`
- [ ] Test with current account data

### Phase 5: Error Handling & Notifications
- [ ] Add error branches to all 3 workflows via `n8n_edit_workflow`
- [ ] Configure email notifications for failures
- [ ] Add validation Code node to each workflow
- [ ] Test error paths with invalid inputs

### Phase 6: Testing & Validation
- [ ] Run each workflow with real sample data
- [ ] Import output JSON into the React app via drag-and-drop
- [ ] Verify data merges correctly
- [ ] Test edge cases: empty PDF, corrupted file, missing fields
- [ ] Validate all outputs against schemas

---

## Known Account IDs (for Workflow 3)

| ID | Account Name | Type | Owner |
|----|-------------|------|-------|
| `savings_romi_analyst` | חסכון לכל ילד - רומי (אנליסט) | monthly | הדס |
| `savings_eli_analyst` | חסכון לכל ילד - אלי (אנליסט) | monthly | הדס |
| `gemel_romi_analyst` | קופ"ג להשקעה רומי (אנליסט) | monthly | גל |
| `gemel_eli_analyst` | קופ"ג להשקעה אלי (אנליסט) | monthly | גל |
| `gemel_parents_mor` | קופ"ג להשקעה הורים (מור) | monthly | גל |
| `tria` | תריא | monthly | shared |
| `kasha_gal_meitav` | קה"ש גל (מיטב) | fixed | גל |
| `kasha_gal_harel` | קה"ש גל (הראל) חדש | fixed | גל |
| `kasha_hadas_mor` | קה"ש הדס (מור גמל ופנסיה) | fixed | הדס |
| `cash_mizrahi` | חשבון מזרחי (ש"ח+מט"ח) | cash | shared |
| `cash_leumi` | חשבון הבינלאומי (ש"ח+ני"ע) | cash | shared |

---

## n8n MCP Development Workflow

This is the step-by-step process Claude Code follows when building each workflow:

### Step 1: Search & Discover
```
Use n8n_search_nodes to find node types:
- "httpRequest" → n8n-nodes-base.httpRequest
- "code" → n8n-nodes-base.code
- "manualTrigger" → n8n-nodes-base.manualTrigger
- "readBinaryFile" → n8n-nodes-base.readBinaryFile
- "writeBinaryFile" → n8n-nodes-base.writeBinaryFile
```

### Step 2: Get Node Parameters
```
Use n8n_search_node_parameters for each node type to get
required fields and configuration schema.
```

### Step 3: Build Workflow JSON
Construct the full workflow JSON with:
- `nodes[]` — each node with type, position, parameters
- `connections{}` — wiring between nodes
- `settings{}` — workflow-level settings

### Step 4: Create via MCP
```
Use n8n_create_workflow with the JSON payload.
Returns workflow ID for future edits.
```

### Step 5: Validate
```
Use n8n_validate_workflow to check for:
- Missing required parameters
- Invalid connections
- Type mismatches
```

### Step 6: Test
- Activate workflow in n8n UI
- Run with sample data
- Check execution logs for errors
- Verify output JSON structure

### Step 7: Iterate
```
Use n8n_edit_workflow to fix issues found during testing.
Re-validate after each edit.
```

---

## File Dependencies

| This Plan References | Purpose |
|---------------------|---------|
| `n8n_monthly_budget_schema.json` | Output schema for Workflows 1 & 2 |
| `n8n_savings_schema.json` | Output schema for Workflow 3 |
| `n8n_integration_guide.md` | Integration strategy (Strategy B) |
| `n8n_workflow_plan.md` | Original workflow plan (superseded by this doc) |
| `public/data/categories.json` | Valid category IDs and names |
| `public/data/monthly_budget.json` | Current budget data structure |
| `public/data/savings_accounts.json` | Current savings data and account IDs |
| `N8N_SKILLS_PLAN.md` | n8n skills available for Claude Code |

---

## Notes

- **No local n8n development** — all workflow operations go through n8n MCP tools
- **Gemini Flash 3** is chosen for Hebrew OCR quality, speed, structured output support, and cost
- **Strategy B** (manual import) is the MVP approach; Strategy C (API endpoint) is a future enhancement
- All Code node JavaScript follows n8n patterns: returns `[{ json: {...} }]` format
- Categorization rules should be refined over time as more vendor patterns are discovered
- The `EXTRAORDINARY_THRESHOLD` (₪2,000) is configurable per workflow
