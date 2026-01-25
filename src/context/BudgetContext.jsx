import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const BudgetContext = createContext(null);

const initialState = {
  monthlyBudget: { months: [], metadata: {} },
  savingsAccounts: { savings_accounts: [], metadata: {} },
  categories: { categories: [] },
  loading: true,
  error: null,
  lastUpdated: null,
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
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case 'UPDATE_MONTH': {
      const updatedMonths = state.monthlyBudget.months.map((m) =>
        m.month === action.payload.month ? action.payload : m
      );
      return {
        ...state,
        monthlyBudget: {
          ...state.monthlyBudget,
          months: updatedMonths,
          metadata: {
            ...state.monthlyBudget.metadata,
            last_updated: new Date().toISOString(),
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    }

    case 'ADD_MONTH': {
      const existingIndex = state.monthlyBudget.months.findIndex(
        (m) => m.month === action.payload.month
      );

      let updatedMonths;
      if (existingIndex >= 0) {
        // Merge with existing month
        const existing = state.monthlyBudget.months[existingIndex];
        updatedMonths = [...state.monthlyBudget.months];
        updatedMonths[existingIndex] = {
          ...existing,
          expenses: { ...existing.expenses, ...action.payload.expenses },
          income: { ...existing.income, ...action.payload.income },
          notes: action.payload.notes || existing.notes,
          updated_at: new Date().toISOString(),
        };
      } else {
        // Add new month and sort
        updatedMonths = [...state.monthlyBudget.months, action.payload].sort(
          (a, b) => a.month.localeCompare(b.month)
        );
      }

      return {
        ...state,
        monthlyBudget: {
          ...state.monthlyBudget,
          months: updatedMonths,
          metadata: {
            ...state.monthlyBudget.metadata,
            last_updated: new Date().toISOString(),
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    }

    case 'UPDATE_SAVINGS':
      return {
        ...state,
        savingsAccounts: action.payload,
        lastUpdated: new Date().toISOString(),
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const loadAllData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const [monthlyBudget, savingsAccounts, categories] = await Promise.all([
        fetch('/data/monthly_budget.json').then((r) => {
          if (!r.ok) throw new Error('Failed to load monthly budget');
          return r.json();
        }),
        fetch('/data/savings_accounts.json').then((r) => {
          if (!r.ok) throw new Error('Failed to load savings accounts');
          return r.json();
        }),
        fetch('/data/categories.json').then((r) => {
          if (!r.ok) throw new Error('Failed to load categories');
          return r.json();
        }),
      ]);

      dispatch({
        type: 'LOAD_DATA',
        payload: { monthlyBudget, savingsAccounts, categories },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = {
    state,
    dispatch,
    reloadData: loadAllData,
  };

  return (
    <BudgetContext.Provider value={value}>
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
