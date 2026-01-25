import { useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { getYearsFromMonths } from '@/utils/dateHelpers';

const Header = ({ activeView, onViewChange, onImportClick, onSaveClick }) => {
  const { state } = useBudget();

  const budgetYear = useMemo(() => {
    const years = getYearsFromMonths(state.monthlyBudget.months || []);
    return years[0] || new Date().getFullYear();
  }, [state.monthlyBudget.months]);

  const navItems = [
    { id: 'dashboard', label: 'דף הבית' },
    { id: 'savings', label: 'חסכונות' },
    { id: 'reports', label: 'דוחות' },
    { id: 'settings', label: 'הגדרות' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-solid border-slate-200 px-6 lg:px-20 py-4 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div
            className="bg-primary p-2 rounded-lg text-white"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-2xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              ניהול תקציב משפחתי
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              שנת התקציב {budgetYear}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="ניווט ראשי"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange?.(item.id)}
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                activeView === item.id
                  ? 'text-primary border-primary font-semibold'
                  : 'text-slate-600 border-transparent hover:text-primary'
              }`}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="ייבוא נתונים מקובץ"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              file_upload
            </span>
            <span className="hidden sm:inline">ייבוא נתונים</span>
          </button>

          <button
            onClick={onSaveClick}
            className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            aria-label="שמירת שינויים"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              save
            </span>
            <span className="hidden sm:inline">שמירה</span>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="תפריט"
          >
            <span className="material-symbols-outlined text-slate-600">
              menu
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
