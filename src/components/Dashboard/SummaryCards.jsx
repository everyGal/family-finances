import { useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
  calculatePercentageChange,
} from '@/utils/calculations';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

const SummaryCards = () => {
  const { state } = useBudget();
  const { monthlyBudget, savingsAccounts } = state;

  const currentMonth = useMemo(() => {
    const months = monthlyBudget.months || [];
    return months[months.length - 1] || null;
  }, [monthlyBudget.months]);

  const previousMonth = useMemo(() => {
    const months = monthlyBudget.months || [];
    return months[months.length - 2] || null;
  }, [monthlyBudget.months]);

  const stats = useMemo(() => {
    const currentIncome = calculateTotalIncome(currentMonth?.income);
    const currentExpenses = calculateTotalExpenses(currentMonth?.expenses);
    const currentSurplus = calculateSurplus(currentMonth);

    const previousIncome = calculateTotalIncome(previousMonth?.income);
    const previousExpenses = calculateTotalExpenses(previousMonth?.expenses);
    const previousSurplus = calculateSurplus(previousMonth);

    const totalSavings = savingsAccounts.metadata?.total_accumulated || 0;

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
        value: totalSavings,
        change: 0.5,
      },
    };
  }, [currentMonth, previousMonth, savingsAccounts]);

  const cards = [
    {
      id: 'income',
      title: 'סה"כ הכנסה',
      value: stats.totalIncome.value,
      change: stats.totalIncome.change,
      icon: 'trending_up',
      iconBgClass: 'bg-emerald-100',
      iconTextClass: 'text-emerald-600',
    },
    {
      id: 'expenses',
      title: 'סה"כ הוצאה',
      value: stats.totalExpenses.value,
      change: stats.totalExpenses.change,
      icon: 'trending_down',
      iconBgClass: 'bg-orange-100',
      iconTextClass: 'text-orange-600',
      invertChange: true,
    },
    {
      id: 'available',
      title: 'הכנסה פנויה',
      value: stats.availableIncome.value,
      change: stats.availableIncome.change,
      icon: 'account_balance',
      iconBgClass: 'bg-blue-100',
      iconTextClass: 'text-blue-600',
    },
    {
      id: 'savings',
      title: 'מצב חסכונות',
      value: stats.totalSavings.value,
      change: stats.totalSavings.change,
      icon: 'savings',
      iconBgClass: 'bg-violet-100',
      iconTextClass: 'text-violet-600',
    },
  ];

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="סיכום חודשי"
    >
      {cards.map((card) => {
        const isPositiveChange = card.invertChange
          ? card.change < 0
          : card.change >= 0;

        return (
          <article
            key={card.id}
            className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-600 text-sm font-medium">
                {card.title}
              </h3>
              <div
                className={`p-2 rounded-lg ${card.iconBgClass}`}
                aria-hidden="true"
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${card.iconTextClass}`}
                >
                  {card.icon}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-slate-900 text-2xl font-bold">
                {formatCurrency(card.value)}
              </p>
              <p
                className={`text-xs font-bold ${
                  isPositiveChange ? 'text-emerald-600' : 'text-orange-600'
                }`}
                aria-label={`שינוי של ${formatPercentage(card.change)} מהחודש הקודם`}
              >
                {formatPercentage(card.change)}
              </p>
            </div>

            <p className="text-xs text-slate-400">בהשוואה לחודש שעבר</p>
          </article>
        );
      })}
    </section>
  );
};

export default SummaryCards;
