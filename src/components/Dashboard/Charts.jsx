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
  ReferenceLine,
} from 'recharts';
import { useBudget } from '@/context/BudgetContext';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSurplus,
} from '@/utils/calculations';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { COLORS } from '@/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-right">
      <p className="font-bold text-slate-900 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-bold" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const Charts = () => {
  const { state } = useBudget();
  const { monthlyBudget } = state;

  const chartData = useMemo(() => {
    const months = monthlyBudget.months || [];
    return months.slice(-6).map((month) => ({
      month: month.month_hebrew,
      income: calculateTotalIncome(month.income),
      expenses: calculateTotalExpenses(month.expenses),
      surplus: calculateSurplus(month),
    }));
  }, [monthlyBudget.months]);

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { avgSurplus: 0, avgIncome: 0, avgExpenses: 0 };
    }

    const totalSurplus = chartData.reduce((sum, d) => sum + d.surplus, 0);
    const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
    const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);

    return {
      avgSurplus: totalSurplus / chartData.length,
      avgIncome: totalIncome / chartData.length,
      avgExpenses: totalExpenses / chartData.length,
    };
  }, [chartData]);

  const latestMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];

  const incomeChange = latestMonth && previousMonth
    ? ((latestMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <span className="material-symbols-outlined text-4xl mb-2">show_chart</span>
        <p>אין מספיק נתונים להצגת גרפים</p>
      </div>
    );
  }

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12"
      aria-label="גרפים"
    >
      {/* Income vs Expenses Line Chart */}
      <article className="bg-white flex flex-col gap-4 rounded-xl border border-slate-200 p-6 shadow-sm">
        <div>
          <h3 className="text-slate-900 text-base font-bold">
            מגמת הכנסות מול הוצאות
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-primary text-xl font-bold tracking-tight">
              {formatCurrency(stats.avgSurplus)}
            </p>
            <span className="text-slate-500 text-sm">עודף ממוצע</span>
            {incomeChange !== 0 && (
              <span
                className={`text-xs font-medium ${
                  incomeChange >= 0 ? 'text-emerald-600' : 'text-orange-600'
                }`}
              >
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% החודש
              </span>
            )}
          </div>
        </div>

        <div className="h-[220px]" role="img" aria-label="גרף קו הכנסות מול הוצאות">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                reversed
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(value) => formatNumber(value / 1000) + 'K'}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-slate-600">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke={COLORS.income}
                strokeWidth={3}
                name="הכנסות"
                dot={{ r: 4, fill: COLORS.income }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke={COLORS.expenses}
                strokeWidth={3}
                strokeDasharray="5 5"
                name="הוצאות"
                dot={{ r: 4, fill: COLORS.expenses }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* Monthly Surplus Bar Chart */}
      <article className="bg-white flex flex-col gap-4 rounded-xl border border-slate-200 p-6 shadow-sm">
        <div>
          <h3 className="text-slate-900 text-base font-bold">
            עודף חודשי (חיסכון)
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-emerald-600 text-xl font-bold tracking-tight">
              {formatCurrency(stats.avgSurplus)}
            </p>
            <span className="text-slate-500 text-sm">ממוצע לחודש</span>
          </div>
        </div>

        <div className="h-[220px]" role="img" aria-label="גרף עמודות עודף חודשי">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                reversed
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(value) => formatNumber(value / 1000) + 'K'}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Bar
                dataKey="surplus"
                name="עודף"
                radius={[6, 6, 0, 0]}
                fill={COLORS.surplus}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default Charts;
