# Family Budget Management Application - Complete Development Plan for Claude Code

## Project Overview
Build a browser-based family budget management application using React, Tailwind CSS, and JSON file storage. The app reads data updated by n8n workflows and provides an intuitive Hebrew RTL interface for managing family finances.

---

## Prerequisites: Install Required Skills

**⚠️ CRITICAL:** Before starting development, install these 6 skills from `RECOMMENDED_SKILLS.md`:

**Core Development:**
- frontend-design (Anthropic)
- react-best-practices (Vercel)
- web-design-guidelines (Vercel)

**Document Generation:**
- pdf (Anthropic)
- xlsx (Anthropic)

**Extensibility:**
- skill-creator (Anthropic)

**Without these skills, Claude Code cannot work optimally!**

See `RECOMMENDED_SKILLS.md` for detailed installation instructions and correct repository links.

---

## Technical Stack

### Core Technologies
- **Frontend Framework:** Vite + React 18
- **Styling:** Tailwind CSS v3 (matching the provided design)
- **Language:** TypeScript (optional, but recommended)
- **Charts:** Recharts v2
- **Icons:** Material Symbols (Google Fonts)
- **Data Storage:** JSON files in `public/data/`
- **State Management:** React Context API + useReducer
- **HTTP Client:** Native Fetch API
- **Date Handling:** date-fns

### Development Tools
- **Package Manager:** npm
- **Dev Server:** Vite
- **Linting:** ESLint
- **Code Formatting:** Prettier

---

## Project Structure

```
family-budget-app/
├── public/
│   ├── data/                          # JSON data files (n8n updates these)
│   │   ├── monthly_budget.json
│   │   ├── savings_accounts.json
│   │   └── categories.json
│   └── favicon.ico
├── src/
│   ├── main.jsx                       # React entry point
│   ├── App.jsx                        # Root component with routing
│   ├── index.css                      # Tailwind imports + custom styles
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx            # Top navigation bar
│   │   │   └── Footer.jsx            # Bottom action bar
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx         # Main dashboard view
│   │   │   ├── SummaryCards.jsx      # 4 summary stat cards
│   │   │   ├── MonthlyTable.jsx      # Editable budget table
│   │   │   └── Charts.jsx            # Income/Expense charts
│   │   ├── Savings/
│   │   │   ├── SavingsView.jsx       # Savings accounts display
│   │   │   └── SavingsCard.jsx       # Individual account card
│   │   ├── Import/
│   │   │   ├── ImportData.jsx        # Drag-drop JSON import
│   │   │   └── ImportPreview.jsx     # Preview before importing
│   │   ├── Settings/
│   │   │   ├── CategoryManager.jsx   # Edit categories
│   │   │   └── CategoryForm.jsx      # Add/edit category form
│   │   └── Common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── ConfirmDialog.jsx
│   ├── context/
│   │   └── BudgetContext.jsx         # Global state management
│   ├── hooks/
│   │   ├── useBudgetData.js          # Fetch and manage budget data
│   │   ├── useSavingsData.js         # Fetch and manage savings data
│   │   └── useCategories.js          # Fetch and manage categories
│   ├── utils/
│   │   ├── dateHelpers.js            # Hebrew month names, formatting
│   │   ├── calculations.js           # Budget calculations (totals, averages)
│   │   ├── formatters.js             # Currency, number formatting
│   │   └── validators.js             # Data validation functions
│   └── constants/
│       └── index.js                  # App constants (colors, categories)
├── package.json
├── vite.config.js
├── tailwind.config.js                # Tailwind configuration with RTL
├── postcss.config.js
├── .eslintrc.cjs
└── README.md
```

---

## Data Structure

### 1. monthly_budget.json
Located in: `public/data/monthly_budget.json`

```json
{
  "months": [
    {
      "month": "2024-01",
      "year": 2024,
      "month_hebrew": "ינו-24",
      "expenses": {
        "mortgage": 3000,
        "savings_investments": 100,
        "insurance": 1000,
        "arnona": 500,
        "vaad_bait": 100,
        "energy": 0,
        "fixed_expenses": 1000,
        "variable_expenses": 5000,
        "extraordinary_expenses": 0,
        "vehicle": 331,
        "school_expenses": 1017,
        "child1_activities": 376,
        "kindergarten": 4400
      },
      "income": {
        "one_time_income": 0,
        "transfers_in": 1500,
        "salaries": 20000,
        "child_allowance": 261
      },
      "notes": "",
      "updated_at": "2024-01-31T23:59:59Z"
    }
  ],
  "metadata": {
    "last_updated": "2024-01-31T23:59:59Z",
    "source": "manual",
    "version": "1.0"
  }
}
```

### 2. savings_accounts.json
Located in: `public/data/savings_accounts.json`

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
      "accumulated": 18121,
      "sort_order": 1,
      "updated_at": "2024-01-31T23:59:59Z"
    }
  ],
  "metadata": {
    "last_updated": "2024-01-31T23:59:59Z",
    "total_monthly_savings": 2304,
    "total_accumulated": 150908
  }
}
```

### 3. categories.json
Located in: `public/data/categories.json`

```json
{
  "categories": [
    {
      "id": "mortgage",
      "name_hebrew": "משכנתא",
      "name_english": "Mortgage",
      "type": "expense",
      "is_fixed": true,
      "sort_order": 1,
      "is_active": true
    },
    {
      "id": "salaries",
      "name_hebrew": "משכורות",
      "name_english": "Salaries",
      "type": "income",
      "is_fixed": true,
      "sort_order": 16,
      "is_active": true
    }
  ]
}
```

---

## Implementation Roadmap

### Phase 1: Project Setup (30 minutes)

**Goal:** Initialize the project with all dependencies and basic configuration

**Steps:**
1. Create new Vite + React project:
   ```bash
   npm create vite@latest family-budget-app -- --template react
   cd family-budget-app
   npm install
   ```

2. Install dependencies:
   ```bash
   npm install tailwindcss postcss autoprefixer
   npm install recharts date-fns
   npm install -D @tailwindcss/forms
   npx tailwindcss init -p
   ```

3. Configure Tailwind with RTL support in `tailwind.config.js`:
   ```javascript
   export default {
     content: ['./index.html', './src/**/*.{js,jsx}'],
     theme: {
       extend: {
         colors: {
           primary: '#137fec',
           'background-light': '#f6f7f8',
           'background-dark': '#101922',
         },
         fontFamily: {
           display: ['Inter', 'sans-serif'],
         },
       },
     },
     plugins: [require('@tailwindcss/forms')],
   }
   ```

4. Update `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     html {
       direction: rtl;
       font-family: 'Inter', sans-serif;
     }
   }

   .material-symbols-outlined {
     font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
   }
   ```

5. Add Material Symbols to `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
   ```

6. Create data directory and add initial JSON files:
   - Copy the example JSON files to `public/data/`

**Success Criteria:**
- Dev server runs (`npm run dev`)
- Tailwind CSS works
- RTL direction is applied
- Material Icons load

---

### Phase 2: Context & Data Layer (1 hour)

**Goal:** Set up global state management and data fetching

**Files to Create:**

#### 1. `src/context/BudgetContext.jsx`
```javascript
import { createContext, useContext, useReducer, useEffect } from 'react';

const BudgetContext = createContext();

const initialState = {
  monthlyBudget: { months: [], metadata: {} },
  savingsAccounts: { savings_accounts: [], metadata: {} },
  categories: { categories: [] },
  loading: true,
  error: null,
};

function budgetReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        monthlyBudget: action.payload.monthlyBudget,
        savingsAccounts: action.payload.savingsAccounts,
        categories: action.payload.categories,
        loading: false,
      };
    case 'UPDATE_MONTH':
      return {
        ...state,
        monthlyBudget: {
          ...state.monthlyBudget,
          months: state.monthlyBudget.months.map(m =>
            m.month === action.payload.month ? action.payload : m
          ),
        },
      };
    case 'ADD_MONTH':
      return {
        ...state,
        monthlyBudget: {
          ...state.monthlyBudget,
          months: [...state.monthlyBudget.months, action.payload].sort(
            (a, b) => a.month.localeCompare(b.month)
          ),
        },
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [monthlyBudget, savingsAccounts, categories] = await Promise.all([
        fetch('/data/monthly_budget.json').then(r => r.json()),
        fetch('/data/savings_accounts.json').then(r => r.json()),
        fetch('/data/categories.json').then(r => r.json()),
      ]);

      dispatch({
        type: 'LOAD_DATA',
        payload: { monthlyBudget, savingsAccounts, categories },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
}
```

#### 2. `src/utils/dateHelpers.js`
```javascript
export const hebrewMonths = {
  '01': 'ינו',
  '02': 'פבר',
  '03': 'מרץ',
  '04': 'אפר',
  '05': 'מאי',
  '06': 'יונ',
  '07': 'יול',
  '08': 'אוג',
  '09': 'ספט',
  '10': 'אוק',
  '11': 'נוב',
  '12': 'דצמ',
};

export function formatMonthHebrew(monthString) {
  // monthString format: "2024-01"
  const [year, month] = monthString.split('-');
  const shortYear = year.slice(-2);
  return `${hebrewMonths[month]}-${shortYear}`;
}

export function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
```

#### 3. `src/utils/calculations.js`
```javascript
export function calculateTotalExpenses(expenses) {
  return Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
}

export function calculateTotalIncome(income) {
  return Object.values(income).reduce((sum, val) => sum + (val || 0), 0);
}

export function calculateSurplus(month) {
  const totalIncome = calculateTotalIncome(month.income);
  const totalExpenses = calculateTotalExpenses(month.expenses);
  return totalIncome - totalExpenses;
}

export function calculatePercentageChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getMonthlyAverage(months, key, field) {
  const values = months.map(m => m[key]?.[field] || 0);
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / (values.length || 1);
}
```

#### 4. `src/utils/formatters.js`
```javascript
export function formatCurrency(amount) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('he-IL').format(num);
}

export function formatPercentage(value, decimals = 1) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}
```

**Success Criteria:**
- Context provider wraps the app
- Data loads from JSON files
- Helper functions work correctly

---

### Phase 3: Layout Components (1 hour)

**Goal:** Build the header, footer, and main layout structure

#### 1. `src/components/Layout/Header.jsx`
```jsx
import { useState } from 'react';

export default function Header({ onImportClick, onSaveClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-lg text-white">
            <span className="material-symbols-outlined text-2xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              ניהול תקציב משפחתי
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              שנת התקציב 2024
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-primary text-sm font-semibold border-b-2 border-primary pb-1"
            href="#"
          >
            דף הבית
          </a>
          <a
            className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            דוחות
          </a>
          <a
            className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            תחזית שנתית
          </a>
          <a
            className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            הגדרות
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_upload
            </span>
            <span className="hidden sm:inline">ייבוא נתונים</span>
          </button>
          <button
            onClick={onSaveClick}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span className="hidden sm:inline">שמירה</span>
          </button>
          <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-600">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
```

#### 2. `src/components/Layout/Footer.jsx`
```jsx
export default function Footer({ onAddExpense, onUpdateIncome, onExportPDF }) {
  return (
    <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10">
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_circle
          </span>
          <span className="text-xs font-bold">הוספת הוצאה</span>
        </button>

        <div className="w-px h-4 bg-white/20"></div>

        <button
          onClick={onUpdateIncome}
          className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            payments
          </span>
          <span className="text-xs font-bold">עדכון הכנסה</span>
        </button>

        <div className="w-px h-4 bg-white/20"></div>

        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            ios_share
          </span>
          <span className="text-xs font-bold">ייצוא PDF</span>
        </button>
      </div>
    </footer>
  );
}
```

**Success Criteria:**
- Header renders with navigation
- Footer action bar appears at bottom
- Buttons trigger placeholder functions

---

### Phase 4: Dashboard Summary Cards (1 hour)

**Goal:** Display the 4 summary stat cards at the top

**Skills Used:** `frontend-design`, `react-best-practices`, `web-design-guidelines`
> Claude will automatically use these skills to create professional, well-styled, accessible components

#### `src/components/Dashboard/SummaryCards.jsx`
```jsx
import { useMemo } from 'react';
import { useBudget } from '../../context/BudgetContext';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
  calculatePercentageChange,
} from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function SummaryCards() {
  const { state } = useBudget();
  const { monthlyBudget, savingsAccounts } = state;

  const currentMonth = useMemo(() => {
    const months = monthlyBudget.months;
    return months[months.length - 1] || {};
  }, [monthlyBudget]);

  const previousMonth = useMemo(() => {
    const months = monthlyBudget.months;
    return months[months.length - 2] || {};
  }, [monthlyBudget]);

  const stats = useMemo(() => {
    const currentIncome = calculateTotalIncome(currentMonth.income || {});
    const currentExpenses = calculateTotalExpenses(currentMonth.expenses || {});
    const currentSurplus = calculateSurplus(currentMonth);

    const previousIncome = calculateTotalIncome(previousMonth.income || {});
    const previousExpenses = calculateTotalExpenses(previousMonth.expenses || {});
    const previousSurplus = calculateSurplus(previousMonth);

    return {
      totalIncome: {
        value: currentIncome,
        change: calculatePercentageChange(currentIncome, previousIncome),
      },
      totalExpenses: {
        value: currentExpenses,
        change: calculatePercentageChange(currentExpenses, previousExpenses),
      },
      availableIncome: {
        value: currentSurplus,
        change: calculatePercentageChange(currentSurplus, previousSurplus),
      },
      totalSavings: {
        value: savingsAccounts.metadata?.total_accumulated || 0,
        change: 0.5, // Static for now
      },
    };
  }, [currentMonth, previousMonth, savingsAccounts]);

  const cards = [
    {
      title: 'סה"כ הכנסה',
      value: stats.totalIncome.value,
      change: stats.totalIncome.change,
      icon: 'trending_up',
      colorClass: 'emerald',
    },
    {
      title: 'סה"כ הוצאה',
      value: stats.totalExpenses.value,
      change: stats.totalExpenses.change,
      icon: 'trending_down',
      colorClass: 'orange',
    },
    {
      title: 'הכנסה פנויה',
      value: stats.availableIncome.value,
      change: stats.availableIncome.change,
      icon: 'account_balance',
      colorClass: 'blue',
    },
    {
      title: 'מצב חסכונות',
      value: stats.totalSavings.value,
      change: stats.totalSavings.change,
      icon: 'savings',
      colorClass: 'blue',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              {card.title}
            </p>
            <div
              className={`p-2 bg-${card.colorClass}-100 dark:bg-${card.colorClass}-900/30 text-${card.colorClass}-600 rounded-lg`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {card.icon}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-slate-900 dark:text-white text-2xl font-bold">
              {formatCurrency(card.value)}
            </p>
            <p
              className={`text-xs font-bold ${
                card.change >= 0 ? 'text-emerald-600' : 'text-orange-600'
              }`}
            >
              {formatPercentage(card.change)}
            </p>
          </div>
          <p className="text-xs text-slate-400">בהשוואה לחודש שעבר</p>
        </div>
      ))}
    </section>
  );
}
```

**Success Criteria:**
- 4 cards display correctly
- Values are calculated from data
- Percentage changes shown with colors

---

### Phase 5: Monthly Budget Table (2 hours)

**Goal:** Create the large editable table showing monthly budget breakdown

**Skills Used:** `react-best-practices`, `frontend-design`, `web-design-guidelines`
> Claude will use these for optimal React patterns, professional UI, and accessibility

#### `src/components/Dashboard/MonthlyTable.jsx`

This is a complex component. Key features:
- Horizontal scrolling for many columns
- Sticky first column (month name)
- Editable cells (click to edit)
- Auto-calculate row totals
- Highlight total columns

```jsx
import { useState, useMemo } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/formatters';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
} from '../../utils/calculations';

export default function MonthlyTable() {
  const { state, dispatch } = useBudget();
  const { monthlyBudget, categories } = state;
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const expenseCategories = useMemo(
    () =>
      categories.categories
        .filter(c => c.type === 'expense' && c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );

  const incomeCategories = useMemo(
    () =>
      categories.categories
        .filter(c => c.type === 'income' && c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );

  const recentMonths = useMemo(() => {
    return monthlyBudget.months.slice(-6); // Last 6 months
  }, [monthlyBudget]);

  function handleCellClick(monthId, category, currentValue) {
    setEditingCell({ monthId, category });
    setEditValue(currentValue || '');
  }

  function handleCellBlur() {
    if (editingCell) {
      const updatedMonth = monthlyBudget.months.find(
        m => m.month === editingCell.monthId
      );
      const categoryType = expenseCategories.find(
        c => c.id === editingCell.category
      )
        ? 'expenses'
        : 'income';

      dispatch({
        type: 'UPDATE_MONTH',
        payload: {
          ...updatedMonth,
          [categoryType]: {
            ...updatedMonth[categoryType],
            [editingCell.category]: parseFloat(editValue) || 0,
          },
        },
      });
    }
    setEditingCell(null);
  }

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">פירוט תקציב שנתי</h2>
          <p className="text-sm text-slate-500 mt-1">עריכה מקוונת</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="sticky right-0 z-20 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                חודש
              </th>
              {expenseCategories.map(cat => (
                <th
                  key={cat.id}
                  className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {cat.name_hebrew}
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-bold text-primary whitespace-nowrap">
                סה"כ הוצאה
              </th>
              {incomeCategories.map(cat => (
                <th
                  key={cat.id}
                  className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {cat.name_hebrew}
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-bold text-primary whitespace-nowrap">
                סה"כ הכנסה
              </th>
            </tr>
          </thead>

          <tbody>
            {recentMonths.map(month => {
              const totalExpenses = calculateTotalExpenses(month.expenses);
              const totalIncome = calculateTotalIncome(month.income);

              return (
                <tr
                  key={month.month}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="sticky right-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 px-4 py-4 text-sm font-bold">
                    {month.month_hebrew}
                  </td>

                  {expenseCategories.map(cat => {
                    const value = month.expenses?.[cat.id] || 0;
                    const isEditing =
                      editingCell?.monthId === month.month &&
                      editingCell?.category === cat.id;

                    return (
                      <td
                        key={cat.id}
                        className="px-4 py-4 text-sm font-normal text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => handleCellClick(month.month, cat.id, value)}
                      >
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={e => e.key === 'Enter' && handleCellBlur()}
                            autoFocus
                            className="w-full bg-white dark:bg-slate-800 border border-primary rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          formatCurrency(value)
                        )}
                      </td>
                    );
                  })}

                  <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white bg-orange-50/20 dark:bg-orange-950/5">
                    {formatCurrency(totalExpenses)}
                  </td>

                  {incomeCategories.map(cat => {
                    const value = month.income?.[cat.id] || 0;
                    const isEditing =
                      editingCell?.monthId === month.month &&
                      editingCell?.category === cat.id;

                    return (
                      <td
                        key={cat.id}
                        className="px-4 py-4 text-sm font-normal text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => handleCellClick(month.month, cat.id, value)}
                      >
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={e => e.key === 'Enter' && handleCellBlur()}
                            autoFocus
                            className="w-full bg-white dark:bg-slate-800 border border-primary rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          formatCurrency(value)
                        )}
                      </td>
                    );
                  })}

                  <td className="px-4 py-4 text-sm font-bold text-primary bg-blue-50/20 dark:bg-blue-950/5">
                    {formatCurrency(totalIncome)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600">
        <span>מציג {recentMonths.length} חודשים מתוך {monthlyBudget.months.length}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
```

**Success Criteria:**
- Table displays with all months
- Columns scroll horizontally
- First column (month) is sticky
- Cells are editable on click
- Totals calculate automatically

---

### Phase 6: Charts (1.5 hours)

**Goal:** Create income/expense trend chart and monthly surplus bar chart using Recharts

#### `src/components/Dashboard/Charts.jsx`
```jsx
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export default function Charts() {
  const { state } = useBudget();
  const { monthlyBudget } = state;

  const chartData = useMemo(() => {
    return monthlyBudget.months.slice(-6).map(month => ({
      month: month.month_hebrew,
      income: calculateTotalIncome(month.income),
      expenses: calculateTotalExpenses(month.expenses),
      surplus: calculateSurplus(month),
    }));
  }, [monthlyBudget]);

  const averageSurplus = useMemo(() => {
    const sum = chartData.reduce((acc, d) => acc + d.surplus, 0);
    return sum / (chartData.length || 1);
  }, [chartData]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
      {/* Income vs Expenses Trend */}
      <div className="bg-white dark:bg-slate-900 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div>
          <h3 className="text-slate-900 dark:text-white text-base font-bold">
            מגמת הכנסות מול הוצאות
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-primary text-xl font-bold tracking-tight">
              {formatCurrency(averageSurplus)} avg
            </p>
            <span className="text-emerald-600 text-xs font-medium">
              +3% החודש
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              reversed
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              formatter={value => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#137fec"
              strokeWidth={3}
              name="הכנסות"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="הוצאות"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Surplus (Bar Chart) */}
      <div className="bg-white dark:bg-slate-900 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div>
          <h3 className="text-slate-900 dark:text-white text-base font-bold">
            עודף חודשי (חיסכון)
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-emerald-600 text-xl font-bold tracking-tight">
              {formatCurrency(averageSurplus)} avg
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              reversed
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              formatter={value => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="surplus"
              fill="#137fec"
              radius={[8, 8, 0, 0]}
              name="עודף"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
```

**Success Criteria:**
- Line chart shows income vs expenses
- Bar chart shows monthly surplus
- Charts are responsive
- Hebrew labels display correctly (RTL)
- Tooltips show currency formatted values

---

### Phase 7: Savings View (1 hour)

**Goal:** Display savings accounts grouped by type

#### `src/components/Savings/SavingsView.jsx`
```jsx
import { useMemo } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function SavingsView() {
  const { state } = useBudget();
  const { savingsAccounts } = state;

  const groupedSavings = useMemo(() => {
    const accounts = savingsAccounts.savings_accounts || [];
    return {
      monthly: accounts.filter(a => a.account_type === 'monthly'),
      fixed: accounts.filter(a => a.account_type === 'fixed'),
      cash: accounts.filter(a => a.account_type === 'cash'),
    };
  }, [savingsAccounts]);

  function SavingsTable({ title, accounts, showMonthly = false }) {
    const total = accounts.reduce((sum, acc) => sum + (acc.accumulated || 0), 0);

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold">חשבון</th>
                {showMonthly && (
                  <>
                    <th className="px-4 py-3 text-xs font-bold">חודשי</th>
                    <th className="px-4 py-3 text-xs font-bold">שנתי</th>
                  </>
                )}
                <th className="px-4 py-3 text-xs font-bold">צבירה</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr
                  key={account.id}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="px-4 py-3">{account.account_name}</td>
                  {showMonthly && (
                    <>
                      <td className="px-4 py-3">
                        {formatCurrency(account.monthly_amount)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(account.yearly_amount)}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 font-bold">
                    {formatCurrency(account.accumulated)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                <td className="px-4 py-3">סה"כ</td>
                {showMonthly && (
                  <>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                  </>
                )}
                <td className="px-4 py-3 text-primary">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">סיכום חסכונות</h2>

      <SavingsTable
        title="חסכונות חודשיים"
        accounts={groupedSavings.monthly}
        showMonthly
      />

      <SavingsTable
        title="קרנות השתלמות (קה&quot;ש)"
        accounts={groupedSavings.fixed}
      />

      <SavingsTable title="חשבונות עו&quot;ש" accounts={groupedSavings.cash} />
    </div>
  );
}
```

**Success Criteria:**
- Three tables display (monthly, fixed, cash)
- Accounts grouped correctly
- Totals calculate correctly
- Clean, readable layout

---

### Phase 8: Import Data Feature (2 hours)

**Goal:** Allow users to drag-drop JSON files from n8n and merge into existing data

#### `src/components/Import/ImportData.jsx`
```jsx
import { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';

export default function ImportData({ onClose }) {
  const { state, dispatch } = useBudget();
  const [dragActive, setDragActive] = useState(false);
  const [importData, setImportData] = useState(null);
  const [error, setError] = useState(null);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileInput(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  async function handleFile(file) {
    if (!file.name.endsWith('.json')) {
      setError('רק קבצי JSON מותרים');
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      setImportData(data);
      setError(null);
    } catch (err) {
      setError('קובץ JSON לא תקין');
    }
  }

  function handleConfirmImport() {
    if (!importData) return;

    // Check if it's monthly budget data
    if (importData.months) {
      importData.months.forEach(newMonth => {
        const existingMonth = state.monthlyBudget.months.find(
          m => m.month === newMonth.month
        );

        if (existingMonth) {
          // Merge with existing
          dispatch({
            type: 'UPDATE_MONTH',
            payload: {
              ...existingMonth,
              expenses: { ...existingMonth.expenses, ...newMonth.expenses },
              income: { ...existingMonth.income, ...newMonth.income },
              updated_at: new Date().toISOString(),
            },
          });
        } else {
          // Add new month
          dispatch({ type: 'ADD_MONTH', payload: newMonth });
        }
      });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">ייבוא נתונים</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {!importData ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">
              cloud_upload
            </span>
            <p className="text-lg font-medium mb-2">גרור ושחרר קובץ JSON כאן</p>
            <p className="text-sm text-slate-500 mb-4">או</p>
            <label className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-primary/90 transition-colors">
              בחר קובץ
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <p className="text-emerald-800 dark:text-emerald-400 font-medium">
                ✓ קובץ נטען בהצלחה
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">
                {importData.months?.length || 0} חודשים נמצאו
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setImportData(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                אישור ייבוא
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Success Criteria:**
- Drag-drop zone works
- File upload button works
- JSON parsing validates correctly
- Preview shows month count
- Merge logic updates existing months or adds new ones

---

### Phase 9: Main App Integration (30 minutes)

**Goal:** Wire everything together in App.jsx

#### `src/App.jsx`
```jsx
import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import SummaryCards from './components/Dashboard/SummaryCards';
import MonthlyTable from './components/Dashboard/MonthlyTable';
import Charts from './components/Dashboard/Charts';
import SavingsView from './components/Savings/SavingsView';
import ImportData from './components/Import/ImportData';

function App() {
  const [showImport, setShowImport] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  function handleSave() {
    // TODO: Implement save to JSON files
    alert('שמירה בוצעה');
  }

  function handleExportPDF() {
    // TODO: Implement PDF export
    alert('ייצוא PDF');
  }

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header
          onImportClick={() => setShowImport(true)}
          onSaveClick={handleSave}
        />

        <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 space-y-8">
          {activeView === 'dashboard' && (
            <>
              <SummaryCards />
              <MonthlyTable />
              <Charts />
            </>
          )}

          {activeView === 'savings' && <SavingsView />}
        </main>

        <Footer
          onAddExpense={() => alert('הוספת הוצאה')}
          onUpdateIncome={() => alert('עדכון הכנסה')}
          onExportPDF={handleExportPDF}
        />

        {showImport && <ImportData onClose={() => setShowImport(false)} />}
      </div>
    </BudgetProvider>
  );
}

export default App;
```

**Success Criteria:**
- App loads without errors
- All components render correctly
- Import modal opens/closes
- Navigation between views works

---

### Phase 10: Polish & Enhancements (1-2 hours)

**Skills Used:** `pdf`, `xlsx`, `react-best-practices` (for testing patterns)
> Use pdf/xlsx skills for exports, react-best-practices for testing guidance

**Remaining tasks:**

1. **Add Testing (IMPORTANT)** ⚠️
   - Write tests for calculation utilities (critical for financial data)
   - Test JSON import validation
   - Test component rendering
   - Run tests before committing
   
   **Note:** While there's no dedicated testing skill, use `react-best-practices` for testing patterns:
   ```
   "Write comprehensive tests for calculateTotalExpenses following React best practices"
   "Add unit tests for JSON validation covering all edge cases"
   "Create component tests for MonthlyTable with various data scenarios"
   ```

2. **Add category management**
   - Create CategoryManager component
   - Allow add/edit/deactivate categories

3. **Implement save to JSON**
   - Download updated JSON files
   - Or save to localStorage as backup

4. **PDF Export** (Use `pdf` skill)
   - Generate printable budget report
   - Monthly summary PDFs
   
   **Prompt:** `"Use the pdf skill to add export functionality for monthly budgets"`

5. **Excel Export** (Use `xlsx` skill)
   - Export all data to Excel with formulas
   
   **Prompt:** `"Use the xlsx skill to export budget data to spreadsheet"`

6. **Dark mode toggle**
   - Add theme switcher
   - Persist preference

7. **Responsive improvements**
   - Test on mobile/tablet
   - Adjust table scrolling

8. **Error boundaries**
   - Add React error boundaries
   - Graceful error handling

9. **Loading states**
   - Show spinners while data loads
   - Skeleton screens

10. **Validation**
    - Validate user inputs
    - Show error messages

---

## MVP Success Criteria

✅ **Core Features:**
1. Display summary cards with real data
2. Show monthly budget table with 6+ months
3. Edit cells inline and auto-save
4. Render income vs expenses chart
5. Render monthly surplus bar chart
6. Display savings accounts grouped by type
7. Import JSON from n8n (drag-drop or file select)
8. Merge imported data with existing
9. Hebrew RTL layout throughout
10. Responsive design (desktop priority)

✅ **Nice to Have (can defer):**
- PDF export
- Category management UI
- Add/delete months
- Dark mode
- Multi-year view
- Advanced filtering

---

## Deployment

### Option 1: Static Hosting (Easiest)
1. Build the app: `npm run build`
2. Upload `dist/` folder to:
   - Netlify (drag-drop)
   - Vercel
   - GitHub Pages
   - Any static host

### Option 2: Local Server
1. Run: `npm run dev`
2. Access at `http://localhost:5173`
3. Share on local network

---

## n8n Integration

1. **n8n generates monthly_budget.json**
2. **User downloads JSON file**
3. **User drags file into app**
4. **App validates and merges**
5. **Data persists in browser (or save manually)**

---

## File Checklist for Claude Code

Create these files in order:

**Phase 1: Setup**
- [ ] package.json
- [ ] vite.config.js
- [ ] tailwind.config.js
- [ ] src/index.css
- [ ] index.html

**Phase 2: Data**
- [ ] public/data/monthly_budget.json
- [ ] public/data/savings_accounts.json
- [ ] public/data/categories.json

**Phase 3: Utils**
- [ ] src/utils/dateHelpers.js
- [ ] src/utils/calculations.js
- [ ] src/utils/formatters.js

**Phase 4: Context**
- [ ] src/context/BudgetContext.jsx

**Phase 5: Layout**
- [ ] src/components/Layout/Header.jsx
- [ ] src/components/Layout/Footer.jsx

**Phase 6: Dashboard**
- [ ] src/components/Dashboard/SummaryCards.jsx
- [ ] src/components/Dashboard/MonthlyTable.jsx
- [ ] src/components/Dashboard/Charts.jsx

**Phase 7: Other Views**
- [ ] src/components/Savings/SavingsView.jsx
- [ ] src/components/Import/ImportData.jsx

**Phase 8: Main App**
- [ ] src/App.jsx
- [ ] src/main.jsx

---

## Development Tips

1. **Start simple:** Get basic rendering working first, then add interactivity
2. **Test with real data:** Use the example JSON files provided
3. **Component-first:** Build each component independently
4. **State management:** Keep state in context, not component props
5. **RTL quirks:** Test Arabic/Hebrew text rendering early

---

## Additional Resources

- Tailwind CSS RTL: https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support
- Recharts Docs: https://recharts.org/
- React Context: https://react.dev/reference/react/useContext
- Vite Guide: https://vitejs.dev/guide/

---

This plan provides a complete roadmap for building the family budget application. Follow the phases sequentially, and you'll have a working MVP in ~10-15 hours of focused development.
