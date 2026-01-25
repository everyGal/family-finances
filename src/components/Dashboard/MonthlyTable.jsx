import { useState, useMemo, useCallback } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
} from '@/utils/calculations';

const MonthlyTable = () => {
  const { state, dispatch } = useBudget();
  const { monthlyBudget, categories } = state;

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [displayCount, setDisplayCount] = useState(6);

  const expenseCategories = useMemo(
    () =>
      categories.categories
        .filter((c) => c.type === 'expense' && c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories.categories]
  );

  const incomeCategories = useMemo(
    () =>
      categories.categories
        .filter((c) => c.type === 'income' && c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories.categories]
  );

  const displayedMonths = useMemo(() => {
    const months = monthlyBudget.months || [];
    return months.slice(-displayCount);
  }, [monthlyBudget.months, displayCount]);

  const handleCellClick = useCallback((monthId, category, categoryType, currentValue) => {
    setEditingCell({ monthId, category, categoryType });
    setEditValue(String(currentValue || 0));
  }, []);

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      const { monthId, category, categoryType } = editingCell;
      const month = monthlyBudget.months.find((m) => m.month === monthId);

      if (month) {
        const newValue = parseFloat(editValue) || 0;
        const currentValue = month[categoryType]?.[category] || 0;

        if (newValue !== currentValue) {
          dispatch({
            type: 'UPDATE_MONTH',
            payload: {
              ...month,
              [categoryType]: {
                ...month[categoryType],
                [category]: newValue,
              },
              updated_at: new Date().toISOString(),
            },
          });
        }
      }
    }
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, monthlyBudget.months, dispatch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  }, [handleCellBlur]);

  const showMoreMonths = () => {
    setDisplayCount((prev) => Math.min(prev + 3, monthlyBudget.months.length));
  };

  const showLessMonths = () => {
    setDisplayCount((prev) => Math.max(prev - 3, 3));
  };

  const renderCell = (month, category, categoryType) => {
    const value = month[categoryType]?.[category.id] || 0;
    const isEditing =
      editingCell?.monthId === month.month &&
      editingCell?.category === category.id &&
      editingCell?.categoryType === categoryType;

    if (isEditing) {
      return (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleCellBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-white border-2 border-primary rounded px-2 py-1 text-sm text-left focus:outline-none"
          dir="ltr"
          aria-label={`ערוך ${category.name_hebrew} עבור ${month.month_hebrew}`}
        />
      );
    }

    return (
      <button
        onClick={() => handleCellClick(month.month, category.id, categoryType, value)}
        className="w-full h-full text-right hover:bg-slate-100 rounded px-1 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        aria-label={`${category.name_hebrew}: ${formatCurrency(value)}. לחץ לעריכה`}
      >
        {formatCurrency(value)}
      </button>
    );
  };

  return (
    <section
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      aria-label="טבלת תקציב חודשי"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">פירוט תקציב שנתי</h2>
          <p className="text-sm text-slate-500 mt-1">לחץ על תא לעריכה</p>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="סנן נתונים"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-600">
              filter_list
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50">
            <tr>
              {/* Sticky Month Column */}
              <th
                className="sticky right-0 z-20 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap border-l border-slate-200 min-w-[100px]"
                scope="col"
              >
                חודש
              </th>

              {/* Expense Headers */}
              {expenseCategories.map((cat) => (
                <th
                  key={cat.id}
                  className="px-3 py-3 text-xs font-bold text-slate-700 whitespace-nowrap min-w-[90px]"
                  scope="col"
                  title={cat.name_english}
                >
                  {cat.name_hebrew}
                </th>
              ))}

              {/* Total Expenses */}
              <th
                className="px-4 py-3 text-xs font-bold text-orange-600 whitespace-nowrap bg-orange-50 border-x border-orange-100 min-w-[100px]"
                scope="col"
              >
                סה&quot;כ הוצאה
              </th>

              {/* Income Headers */}
              {incomeCategories.map((cat) => (
                <th
                  key={cat.id}
                  className="px-3 py-3 text-xs font-bold text-slate-700 whitespace-nowrap min-w-[90px]"
                  scope="col"
                  title={cat.name_english}
                >
                  {cat.name_hebrew}
                </th>
              ))}

              {/* Total Income */}
              <th
                className="px-4 py-3 text-xs font-bold text-primary whitespace-nowrap bg-blue-50 border-x border-blue-100 min-w-[100px]"
                scope="col"
              >
                סה&quot;כ הכנסה
              </th>

              {/* Surplus */}
              <th
                className="px-4 py-3 text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 min-w-[100px]"
                scope="col"
              >
                עודף
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedMonths.map((month) => {
              const totalExpenses = calculateTotalExpenses(month.expenses);
              const totalIncome = calculateTotalIncome(month.income);
              const surplus = calculateSurplus(month);

              return (
                <tr
                  key={month.month}
                  className="group hover:bg-slate-50/50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  {/* Sticky Month Cell */}
                  <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3 font-bold text-slate-900 border-l border-slate-200">
                    {month.month_hebrew}
                  </td>

                  {/* Expense Cells */}
                  {expenseCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="px-2 py-2 text-slate-600"
                    >
                      {renderCell(month, cat, 'expenses')}
                    </td>
                  ))}

                  {/* Total Expenses Cell */}
                  <td className="px-4 py-3 font-bold text-slate-900 bg-orange-50/50 border-x border-orange-100">
                    {formatCurrency(totalExpenses)}
                  </td>

                  {/* Income Cells */}
                  {incomeCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="px-2 py-2 text-slate-600"
                    >
                      {renderCell(month, cat, 'income')}
                    </td>
                  ))}

                  {/* Total Income Cell */}
                  <td className="px-4 py-3 font-bold text-primary bg-blue-50/50 border-x border-blue-100">
                    {formatCurrency(totalIncome)}
                  </td>

                  {/* Surplus Cell */}
                  <td
                    className={`px-4 py-3 font-bold bg-emerald-50/50 ${
                      surplus >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(surplus)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
        <span>
          מציג {displayedMonths.length} חודשים מתוך {monthlyBudget.months.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={showMoreMonths}
            disabled={displayCount >= monthlyBudget.months.length}
            className="p-1 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="הצג עוד חודשים"
          >
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button
            onClick={showLessMonths}
            disabled={displayCount <= 3}
            className="p-1 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="הצג פחות חודשים"
          >
            <span className="material-symbols-outlined text-sm">expand_less</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MonthlyTable;
