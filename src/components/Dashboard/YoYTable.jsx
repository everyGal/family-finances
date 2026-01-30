import { useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { formatPercentage } from '@/utils/formatters';
import { formatMonthHebrewFull } from '@/utils/dateHelpers';
import {
  calculateTotalExpenses,
  calculatePercentageChange,
} from '@/utils/calculations';

const YoYTable = ({ selectedYear, selectedMonths }) => {
  const { state } = useBudget();
  const { monthlyBudget, categories } = state;

  const expenseCategories = useMemo(
    () =>
      categories.categories
        .filter((c) => c.type === 'expense' && c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories.categories]
  );

  const previousYear = selectedYear - 1;

  const monthPairs = useMemo(() => {
    const months = monthlyBudget.months || [];
    return selectedMonths.map((monthNum) => {
      const currentKey = `${selectedYear}-${monthNum}`;
      const previousKey = `${previousYear}-${monthNum}`;
      const current = months.find((m) => m.month === currentKey);
      const previous = months.find((m) => m.month === previousKey);
      return { monthNum, current, previous };
    });
  }, [monthlyBudget.months, selectedYear, previousYear, selectedMonths]);

  const getCategoryValue = (month, catId) => {
    return month?.expenses?.[catId] || 0;
  };

  return (
    <section
      className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden"
      aria-label="השוואה שנתית"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">פירוט תקציב שנתי - מבט השוואתי</h2>
          <p className="text-sm text-slate-500 mt-1">
            השוואת ביצועים תקציביים שנה מול שנה (YoY) — {selectedYear} מול {previousYear}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-right text-sm border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky right-0 z-20 bg-slate-50 px-4 py-4 text-xs font-semibold text-slate-600 min-w-[140px] border-l border-slate-200">
                חודש / שנה
              </th>
              {expenseCategories.map((cat) => (
                <th
                  key={cat.id}
                  className="px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap"
                  title={cat.name_english}
                >
                  {cat.name_hebrew}
                </th>
              ))}
              <th className="px-4 py-4 text-xs font-bold text-orange-600 whitespace-nowrap bg-orange-50 border-x border-orange-100 min-w-[100px]">
                סה&quot;כ חודשי
              </th>
            </tr>
          </thead>

          {monthPairs.map(({ monthNum, current, previous }) => {
              const currentTotal = current ? calculateTotalExpenses(current.expenses) : 0;
              const previousTotal = previous ? calculateTotalExpenses(previous.expenses) : 0;
              const change = calculatePercentageChange(currentTotal, previousTotal);
              const hasData = current || previous;

              if (!hasData) return null;

              return (
                <tbody key={monthNum}>
                  {/* Current year row */}
                  <tr className="group hover:bg-slate-50/50 transition-colors">
                    <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3 align-middle border-r-4 border-primary border-l border-slate-200">
                      <div className="font-bold text-slate-900">
                        {current ? formatMonthHebrewFull(current.month) : `${monthNum}/${selectedYear}`}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">השנה הנוכחית</div>
                    </td>
                    {expenseCategories.map((cat) => (
                      <td key={cat.id} className="px-4 py-3 text-slate-600">
                        {current ? formatCurrency(getCategoryValue(current, cat.id)) : '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 font-bold text-slate-900 bg-orange-50/50 border-x border-orange-100">
                      {current ? formatCurrency(currentTotal) : '—'}
                    </td>
                  </tr>

                  {/* Previous year row */}
                  <tr className="group bg-slate-50/50">
                    <td className="sticky right-0 z-10 bg-slate-50/50 group-hover:bg-slate-100/50 px-4 py-3 align-middle border-r-4 border-slate-300 border-l border-slate-200">
                      <div className="font-semibold text-slate-500 text-sm">
                        {previous ? formatMonthHebrewFull(previous.month) : `${monthNum}/${previousYear}`}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">שנה קודמת</div>
                    </td>
                    {expenseCategories.map((cat) => (
                      <td key={cat.id} className="px-4 py-3 text-slate-400">
                        {previous ? formatCurrency(getCategoryValue(previous, cat.id)) : '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 font-semibold text-slate-500 bg-orange-50/30 border-x border-orange-100">
                      {previous ? formatCurrency(previousTotal) : '—'}
                    </td>
                  </tr>

                  {/* Delta row */}
                  {current && previous && (
                    <tr className="bg-white border-b-2 border-slate-200">
                      <td className="sticky right-0 z-10 bg-white px-4 py-1 text-xs font-semibold border-l border-slate-200" colSpan={1}>
                        שינוי שנתי (Δ)
                      </td>
                      {expenseCategories.map((cat) => {
                        const curVal = getCategoryValue(current, cat.id);
                        const prevVal = getCategoryValue(previous, cat.id);
                        const catChange = calculatePercentageChange(curVal, prevVal);
                        if (prevVal === 0 && curVal === 0) {
                          return <td key={cat.id} className="px-4 py-1 text-xs text-slate-400">—</td>;
                        }
                        return (
                          <td key={cat.id} className="px-4 py-1">
                            <span className={`text-xs font-bold ${catChange > 0 ? 'text-red-600' : catChange < 0 ? 'text-green-600' : 'text-slate-400'}`}>
                              {formatPercentage(catChange)}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-1 bg-orange-50/30 border-x border-orange-100">
                        <div className={`flex items-center gap-1 font-bold text-xs ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          <span className="material-symbols-outlined text-xs">
                            {change > 0 ? 'trending_up' : 'trending_down'}
                          </span>
                          <span>{formatPercentage(Math.abs(change), 1, false)}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
        <span>
          מציג {monthPairs.filter((p) => p.current || p.previous).length} חודשים בהשוואה YoY
        </span>
      </div>
    </section>
  );
};

export default YoYTable;
