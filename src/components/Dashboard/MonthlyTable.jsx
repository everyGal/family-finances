import { useState, useMemo, useCallback } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { formatMonthHebrew } from '@/utils/dateHelpers';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
} from '@/utils/calculations';

const MonthlyTable = ({ selectedYear, selectedMonths }) => {
  const { state, dispatch } = useBudget();
  const { monthlyBudget, categories } = state;

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [addRowValues, setAddRowValues] = useState({});
  const [addRowMonth, setAddRowMonth] = useState('');

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
    let months = monthlyBudget.months || [];

    // Filter by year and months if provided
    if (selectedYear) {
      months = months.filter((m) => m.year === selectedYear || m.month?.startsWith(String(selectedYear)));
    }
    if (selectedMonths && selectedMonths.length > 0) {
      months = months.filter((m) => {
        const monthNum = m.month?.split('-')[1];
        return selectedMonths.includes(monthNum);
      });
    }

    if (!selectedYear) {
      months = months.slice(-displayCount);
    }

    return months;
  }, [monthlyBudget.months, displayCount, selectedYear, selectedMonths]);

  const toggleRowSelection = useCallback((monthId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(monthId)) {
        next.delete(monthId);
      } else {
        next.add(monthId);
      }
      return next;
    });
  }, []);

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

  const handleAddRow = useCallback(() => {
    if (!addRowMonth || !/^\d{4}-\d{2}$/.test(addRowMonth)) return;

    const existing = monthlyBudget.months.find((m) => m.month === addRowMonth);
    if (existing) return;

    const [yearStr, monthNum] = addRowMonth.split('-');
    const expenses = {};
    const income = {};

    expenseCategories.forEach((cat) => {
      expenses[cat.id] = parseFloat(addRowValues[`expenses_${cat.id}`]) || 0;
    });
    incomeCategories.forEach((cat) => {
      income[cat.id] = parseFloat(addRowValues[`income_${cat.id}`]) || 0;
    });

    dispatch({
      type: 'ADD_MONTH',
      payload: {
        month: addRowMonth,
        year: parseInt(yearStr),
        month_hebrew: formatMonthHebrew(addRowMonth),
        expenses,
        income,
        notes: '',
        updated_at: new Date().toISOString(),
      },
    });

    setAddRowMonth('');
    setAddRowValues({});
  }, [addRowMonth, addRowValues, monthlyBudget.months, expenseCategories, incomeCategories, dispatch]);

  const handleAddRowKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAddRow();
    }
  }, [handleAddRow]);

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
          <p className="text-sm text-slate-500 mt-1">לחץ על תא לעריכה, לחץ על שורה לסימון</p>
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
              const isSelected = selectedRows.has(month.month);

              return (
                <tr
                  key={month.month}
                  className={`group border-b border-slate-100 last:border-0 transition-colors cursor-pointer ${
                    isSelected ? 'selected-row' : 'hover:bg-slate-50/50'
                  }`}
                  onClick={() => toggleRowSelection(month.month)}
                >
                  {/* Sticky Month Cell */}
                  <td className={`sticky right-0 z-10 px-4 py-3 font-bold text-slate-900 border-l border-slate-200 ${
                    isSelected ? 'bg-blue-50' : 'bg-white group-hover:bg-slate-50'
                  }`}>
                    {month.month_hebrew}
                  </td>

                  {/* Expense Cells */}
                  {expenseCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="px-2 py-2 text-slate-600"
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
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

            {/* Add Row */}
            <tr className="bg-slate-50/30 border-t-2 border-dashed border-slate-200">
              <td className="sticky right-0 z-10 bg-slate-50/30 px-4 py-3 border-l border-slate-200">
                <input
                  type="text"
                  value={addRowMonth}
                  onChange={(e) => setAddRowMonth(e.target.value)}
                  onKeyDown={handleAddRowKeyDown}
                  placeholder="YYYY-MM"
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold placeholder:text-slate-400 text-right"
                  dir="ltr"
                />
              </td>
              {expenseCategories.map((cat) => (
                <td key={cat.id} className="px-2 py-3">
                  <input
                    type="text"
                    value={addRowValues[`expenses_${cat.id}`] || ''}
                    onChange={(e) => setAddRowValues((prev) => ({ ...prev, [`expenses_${cat.id}`]: e.target.value }))}
                    onKeyDown={handleAddRowKeyDown}
                    placeholder="₪"
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-right placeholder:text-slate-400"
                  />
                </td>
              ))}
              <td className="px-4 py-3 bg-orange-50/30 border-x border-orange-100">
                <span className="text-xs text-slate-400 italic">—</span>
              </td>
              {incomeCategories.map((cat) => (
                <td key={cat.id} className="px-2 py-3">
                  <input
                    type="text"
                    value={addRowValues[`income_${cat.id}`] || ''}
                    onChange={(e) => setAddRowValues((prev) => ({ ...prev, [`income_${cat.id}`]: e.target.value }))}
                    onKeyDown={handleAddRowKeyDown}
                    placeholder="₪"
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-right placeholder:text-slate-400"
                  />
                </td>
              ))}
              <td className="px-4 py-3 bg-blue-50/30 border-x border-blue-100">
                <span className="text-xs text-slate-400 italic">—</span>
              </td>
              <td className="px-4 py-3 bg-emerald-50/30">
                <span className="text-xs text-slate-400 italic">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer with pagination and add button */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddRow}
            disabled={!addRowMonth}
            className="flex items-center gap-2 text-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
            <span>הוסף שורה חדשה</span>
          </button>
          <span>
            מציג {displayedMonths.length} חודשים מתוך {monthlyBudget.months.length}
          </span>
        </div>
        {!selectedYear && (
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
        )}
      </div>
    </section>
  );
};

export default MonthlyTable;
