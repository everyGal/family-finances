// Color palette for the application
export const COLORS = {
  primary: '#137fec',
  primaryHover: '#0f6bc7',

  // Chart colors
  income: '#137fec',
  expenses: '#f59e0b',
  surplus: '#10b981',
  deficit: '#ef4444',

  // Category colors for charts
  chart: [
    '#137fec', // primary blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#6366f1', // indigo
    '#14b8a6', // teal
  ],
};

// Savings account types
export const SAVINGS_ACCOUNT_TYPES = {
  monthly: {
    id: 'monthly',
    label: 'חסכונות חודשיים',
    description: 'חסכונות עם הפקדה חודשית קבועה',
  },
  fixed: {
    id: 'fixed',
    label: 'קרנות השתלמות',
    description: 'קרנות השתלמות ופיקדונות',
  },
  cash: {
    id: 'cash',
    label: 'חשבונות עו"ש',
    description: 'חשבונות בנק ונזילים',
  },
};

// Navigation items
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'דף הבית', icon: 'home' },
  { id: 'reports', label: 'דוחות', icon: 'bar_chart' },
  { id: 'forecast', label: 'תחזית שנתית', icon: 'trending_up' },
  { id: 'settings', label: 'הגדרות', icon: 'settings' },
];

// Default expense categories (fallback if categories.json fails)
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'mortgage', name_hebrew: 'משכנתא', is_fixed: true },
  { id: 'insurance', name_hebrew: 'ביטוחים', is_fixed: true },
  { id: 'arnona', name_hebrew: 'ארנונה', is_fixed: true },
  { id: 'energy', name_hebrew: 'אנרגיה', is_fixed: true },
  { id: 'variable_expenses', name_hebrew: 'הוצאות משתנות', is_fixed: false },
];

// Default income categories (fallback)
export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'salaries', name_hebrew: 'משכורות', is_fixed: true },
  { id: 'child_allowance', name_hebrew: 'קצבת ילדים', is_fixed: true },
  { id: 'transfers_in', name_hebrew: 'העברות נכנסות', is_fixed: false },
  { id: 'one_time_income', name_hebrew: 'הכנסות חד"פ', is_fixed: false },
];

// Toast notification durations
export const TOAST_DURATION = {
  short: 3000,
  normal: 5000,
  long: 8000,
};

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'family-budget-theme',
  lastView: 'family-budget-last-view',
  preferences: 'family-budget-preferences',
};

// API/Data paths
export const DATA_PATHS = {
  monthlyBudget: '/data/monthly_budget.json',
  savingsAccounts: '/data/savings_accounts.json',
  categories: '/data/categories.json',
};

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
