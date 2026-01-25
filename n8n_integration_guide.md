# n8n Integration Guide for Family Budget App

## Overview
This document describes how n8n workflows should generate and update data files for the Family Budget Application.

## Data Files Structure

The application reads 3 JSON files:
1. `monthly_budget.json` - Monthly income and expenses
2. `savings_accounts.json` - Savings, investments, and cash accounts
3. `categories.json` - Editable expense/income categories

## File Locations

In production:
- Files should be placed in: `public/data/` directory
- The app will read them via HTTP requests

For development/testing:
- Place files in: `src/data/` directory

## n8n Workflow Outputs

### Workflow 1: Credit Card Report Processor

**Input:** Monthly credit card PDF/CSV report
**Output:** Updates `monthly_budget.json`

**Process:**
1. Parse credit card report (PDF/CSV)
2. Categorize expenses using AI/rules
3. Calculate totals for `variable_expenses`
4. Identify any `extraordinary_expenses` (large purchases >2000₪)
5. Load existing `monthly_budget.json`
6. Update or add the relevant month's data
7. Save updated `monthly_budget.json`

**Example n8n Output Node:**
```json
{
  "month": "2024-01",
  "year": 2024,
  "month_hebrew": "ינו-24",
  "expenses": {
    "variable_expenses": 5247,
    "extraordinary_expenses": 0
  },
  "updated_at": "2024-01-31T14:30:00Z"
}
```

This should be merged into the existing monthly_budget.json file.

### Workflow 2: Invoice Processor (Email/Mobile)

**Input:** Invoice PDF/image from email or uploaded
**Output:** Updates relevant category in `monthly_budget.json`

**Process:**
1. Extract invoice data (amount, date, description)
2. Determine category (energy, insurance, etc.)
3. Determine month from invoice date
4. Load existing `monthly_budget.json`
5. Update the specific category for that month
6. Save updated `monthly_budget.json`

**Example n8n Output:**
```json
{
  "month": "2024-01",
  "category": "energy",
  "amount": 450,
  "description": "חשבון חשמל ינואר",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Workflow 3: Savings Account Updater

**Input:** Manual trigger or scheduled (monthly)
**Output:** Updates `savings_accounts.json`

**Process:**
1. Query bank APIs or receive manual input
2. Update `accumulated` values for each account
3. Recalculate totals
4. Save `savings_accounts.json`

## Update Strategies

### Strategy A: Direct File Update (Recommended)
n8n workflow directly updates the JSON files in the app's public/data directory.

**Pros:**
- Simple
- No API needed
- Works with static hosting

**Cons:**
- Needs file system access from VPS to your local machine
- Can use cloud storage (Google Drive, Dropbox) as intermediate

### Strategy B: Manual Import
n8n creates output JSON → User downloads → User drags/drops into app

**Pros:**
- Simple
- No network access needed

**Cons:**
- Manual step required

### Strategy C: API Endpoint (Future)
App exposes simple REST API → n8n POSTs updates

**Pros:**
- Fully automated
- Real-time updates

**Cons:**
- Requires backend server
- More complex setup

## Recommended Approach for MVP

**Use Strategy B with file watching:**

1. n8n workflow generates output JSON files
2. Save to a shared folder (Google Drive, Dropbox, or local network share)
3. App has "Import Data" button
4. User downloads the JSON file from shared location
5. User drags/drops into app
6. App validates and merges the data

## JSON File Merge Logic

### For monthly_budget.json:

```javascript
// Pseudo-code for merging
function mergeMonthlyBudget(existing, update) {
  const existingMonth = existing.months.find(m => m.month === update.month);
  
  if (existingMonth) {
    // Update existing month
    existingMonth.expenses = {
      ...existingMonth.expenses,
      ...update.expenses
    };
    existingMonth.income = {
      ...existingMonth.income,
      ...update.income
    };
    existingMonth.updated_at = update.updated_at;
  } else {
    // Add new month
    existing.months.push(update);
    // Sort by date
    existing.months.sort((a, b) => a.month.localeCompare(b.month));
  }
  
  // Update metadata
  existing.metadata.last_updated = new Date().toISOString();
  
  return existing;
}
```

## n8n Workflow Examples

### Example 1: Credit Card Categorization

```
[Trigger: File Upload] 
  → [Extract Text/Data from PDF] 
  → [AI Categorization Node]
  → [Group by Category]
  → [Calculate Totals]
  → [Read monthly_budget.json]
  → [Merge Data]
  → [Write monthly_budget.json]
  → [Upload to Google Drive/Dropbox]
```

### Example 2: Invoice Processing

```
[Trigger: Email Received with Attachment]
  → [Download PDF Attachment]
  → [OCR/Extract Invoice Data]
  → [Identify Amount, Date, Vendor]
  → [Map to Category]
  → [Read monthly_budget.json]
  → [Update Specific Month + Category]
  → [Write JSON]
  → [Upload to Cloud]
```

## Validation Rules

n8n should validate before updating:

1. **Amounts:** Must be non-negative numbers
2. **Dates:** Valid ISO date format
3. **Month:** Valid YYYY-MM format
4. **Categories:** Must match existing category keys
5. **Required fields:** month, year, month_hebrew

## Error Handling

If n8n encounters errors:
1. Log the error
2. Send notification (email/Slack)
3. Create a "failed_imports.json" file with problematic data
4. User can manually review and fix

## Testing n8n Outputs

Use these test files to validate your n8n workflows:

**Test 1: Add new month**
```json
{
  "month": "2024-04",
  "year": 2024,
  "month_hebrew": "אפר-24",
  "expenses": {
    "variable_expenses": 4500
  }
}
```

**Test 2: Update existing month**
```json
{
  "month": "2024-01",
  "expenses": {
    "energy": 600
  }
}
```

**Test 3: Update savings**
```json
{
  "account_id": "savings_romi_analyst",
  "accumulated": 18500,
  "updated_at": "2024-02-01T00:00:00Z"
}
```

## Future Enhancements

1. **Webhook Receiver:** App listens for n8n webhooks
2. **Conflict Resolution:** Handle simultaneous updates
3. **Version Control:** Keep history of all changes
4. **Rollback:** Undo bad imports
5. **Real-time Sync:** WebSocket connection for live updates

## Support

For questions about:
- Data format: See schema files
- Merging logic: See app source code
- n8n workflows: Check n8n community forum
