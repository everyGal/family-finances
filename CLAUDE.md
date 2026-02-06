# Family Budget Management Application

This is a Hebrew RTL browser-based application for managing family budget with n8n integration.

## Tech Stack
- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS v3 (RTL configured)
- **Charts**: Recharts v2
- **Language**: Hebrew (RTL primary), TypeScript optional
- **Data Storage**: JSON files in `public/data/`

## Code Style

### JavaScript/React
- Use ES modules (import/export), not CommonJS
- Destructure imports: `import { useState } from 'react'`
- Use arrow functions for components: `const Component = () => { ... }`
- Prefer const over let; avoid var entirely

### RTL (Right-to-Left)
- **CRITICAL**: All layout must support Hebrew RTL
- Set `dir="rtl"` on html element
- Use Tailwind's RTL utilities (classes work automatically in RTL mode)
- Test text alignment: Hebrew text should align right naturally
- Icons: Material Symbols only, loaded from Google Fonts CDN

### File Organization
- Components in `src/components/[Category]/ComponentName.jsx`
- Utilities in `src/utils/functionName.js`
- Context providers in `src/context/`
- All data files must be in `public/data/` (not src)

## Data Files

### Location & Format
**All data files MUST be in `public/data/`**, not in src directory:
- `public/data/monthly_budget.json` - Monthly income/expenses
- `public/data/savings_accounts.json` - Savings accounts data
- `public/data/categories.json` - Expense/income categories

These are loaded via fetch(`/data/filename.json`) at runtime.

### Data Schema Rules
- All amounts are non-negative numbers
- Month format: "YYYY-MM" (e.g., "2024-01")
- Month Hebrew format: "MMM-YY" (e.g., "ינו-24")
- Dates: ISO 8601 format ("2024-01-31T23:59:59Z")
- Category IDs: snake_case (e.g., "variable_expenses")
- Category names (Hebrew): Use actual Hebrew strings

### Calculations
- Total expenses = sum of all expense category values
- Total income = sum of all income category values  
- Surplus = total income - total expenses
- These are calculated on-demand, not stored

## n8n Integration

The app reads JSON files that n8n workflows update. Users import JSON files via drag-and-drop.

**Merge Logic**:
- Existing month → merge/update values (never delete existing fields)
- New month → append to months array and sort by month ascending
- Always preserve existing data not in the import

**Import Validation**:
- Check file extension is .json
- Validate JSON.parse succeeds
- Verify required fields: month, year (at minimum)
- Show user-friendly error messages on validation failure

## Workflow

### Development
```bash
npm run dev          # Start dev server (default: http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing UI Changes
After making UI changes:
1. Start dev server: `npm run dev`
2. Open browser to http://localhost:5173
3. Verify Hebrew RTL layout looks correct
4. Check responsive behavior (resize browser)
5. Test with actual JSON data from `public/data/`

### Before Committing
- Run `npm run build` to ensure no build errors
- Check console for warnings/errors
- Verify all Hebrew text displays correctly in RTL

## Common Patterns

### Currency Formatting
Always use the formatter utility, never hardcode:
```javascript
import { formatCurrency } from '@/utils/formatters';
const display = formatCurrency(12345); // "₪12,345"
```

### Hebrew Month Names
Use the helper, don't hardcode:
```javascript
import { formatMonthHebrew } from '@/utils/dateHelpers';
const display = formatMonthHebrew("2024-01"); // "ינו-24"
```

### Context Access
Use the custom hook, not useContext directly:
```javascript
import { useBudget } from '@/context/BudgetContext';
const { state, dispatch } = useBudget();
```

### Loading States
Always show loading indicators:
```javascript
if (state.loading) return <LoadingSpinner />;
if (state.error) return <ErrorMessage error={state.error} />;
// ... render actual content
```

## Common Gotchas

### RTL Issues
- **Problem**: Elements not mirroring correctly in RTL
- **Fix**: Tailwind handles most RTL automatically, but use `start-` and `end-` prefixes instead of `left-` and `right-` for future-proof code

### JSON File Location
- **Problem**: Can't load data files  
- **Fix**: Data files MUST be in `public/data/`, NOT `src/data/`. Vite serves public/ as static assets.

### Chart Direction
- **Problem**: Recharts x-axis labels in wrong order
- **Fix**: Add `reversed` prop to `<XAxis>` component for RTL

### Import Errors
- **Problem**: Import fails silently or shows wrong error
- **Fix**: Always wrap JSON.parse in try/catch and show specific error to user

## Architecture Decisions

### Why JSON files instead of SQLite?
- Simpler for browser environment (no native dependencies)
- Easy for n8n to generate and update
- Human-readable for debugging
- Easy to backup and version control

### Why Vite over Create React App?
- Faster dev server and build times
- Better defaults for modern React
- Smaller bundle sizes
- Active maintenance

### Why Recharts over Chart.js?
- React-native (declarative components)
- Good RTL support
- Simpler API for common use cases
- Good TypeScript support if we add it later

## Available Skills

This project uses 13 Claude Code skills for optimal development:

**Core Development:**
- `frontend-design` - Professional UI/UX design (Anthropic)
- `react-best-practices` - React performance optimization with 40+ rules (Vercel)
- `web-design-guidelines` - Web accessibility and UX best practices (Vercel)

**Document Generation:**
- `pdf` - Export budget reports to PDF (Anthropic)
- `xlsx` - Export/import Excel spreadsheets (Anthropic)

**n8n Workflow Development (user-level):**
- `n8n-workflow-patterns` - 5 architectural patterns: webhook, HTTP API, DB, AI agent, scheduled
- `n8n-expression-syntax` - Expression `{{ }}` syntax, `$json/$node/$now` variables
- `n8n-code-javascript` - JavaScript in Code nodes, `$input/$helpers`, error prevention
- `n8n-code-python` - Python in Code nodes (standard library only)
- `n8n-mcp-tools-expert` - n8n-mcp MCP tools: search, validate, create/edit workflows
- `n8n-node-configuration` - Operation-aware node config, property dependencies
- `n8n-validation-expert` - Validation errors, profiles, false positives, fix cycles

**Extensibility:**
- `skill-creator` - Create custom project-specific skills (Anthropic)

**Important:** Assume these skills are installed and available. Use them automatically when relevant.

For full details and installation instructions, see `RECOMMENDED_SKILLS.md`.
For n8n skills details, see `N8N_SKILLS_PLAN.md`.

## Future Enhancements (Not MVP)
These are planned but not in initial implementation:
- PDF export functionality
- Category management UI (add/edit/delete categories)
- Dark mode toggle
- Multi-year view
- Advanced filtering and search
- Automatic n8n sync (webhook listener)
