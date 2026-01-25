import { useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorMessage from '@/components/Common/ErrorMessage';
import { formatCurrency } from '@/utils/formatters';
import { SAVINGS_ACCOUNT_TYPES } from '@/constants';

const SavingsTable = ({ title, description, accounts, showMonthly = false }) => {
  const total = accounts.reduce((sum, acc) => sum + (acc.accumulated || 0), 0);
  const monthlyTotal = accounts.reduce((sum, acc) => sum + (acc.monthly_amount || 0), 0);

  if (accounts.length === 0) {
    return null;
  }

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-bold text-slate-700 whitespace-nowrap"
              >
                שם חשבון
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap"
              >
                בעלים
              </th>
              {showMonthly && (
                <>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap"
                  >
                    הפקדה חודשית
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap"
                  >
                    הפקדה שנתית
                  </th>
                </>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-xs font-bold text-primary whitespace-nowrap"
              >
                צבירה
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr
                key={account.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {account.account_name}
                  {account.notes && (
                    <p className="text-xs text-slate-500 mt-1">{account.notes}</p>
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600">{account.owner}</td>
                {showMonthly && (
                  <>
                    <td className="px-4 py-4 text-slate-600">
                      {account.monthly_amount > 0
                        ? formatCurrency(account.monthly_amount)
                        : '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {account.yearly_amount > 0
                        ? formatCurrency(account.yearly_amount)
                        : '-'}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 font-bold text-slate-900">
                  {formatCurrency(account.accumulated)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-bold">
            <tr>
              <td className="px-6 py-4 text-slate-900">סה&quot;כ</td>
              <td className="px-4 py-4"></td>
              {showMonthly && (
                <>
                  <td className="px-4 py-4 text-slate-700">
                    {monthlyTotal > 0 ? formatCurrency(monthlyTotal) : '-'}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {monthlyTotal > 0 ? formatCurrency(monthlyTotal * 12) : '-'}
                  </td>
                </>
              )}
              <td className="px-6 py-4 text-primary">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </article>
  );
};

const SummaryCard = ({ label, value, icon, colorClass }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{formatCurrency(value)}</p>
      </div>
    </div>
  </div>
);

const SavingsView = () => {
  const { state, reloadData } = useBudget();
  const { savingsAccounts, loading, error } = state;

  const groupedSavings = useMemo(() => {
    const accounts = savingsAccounts.savings_accounts || [];
    return {
      monthly: accounts
        .filter((a) => a.account_type === 'monthly')
        .sort((a, b) => a.sort_order - b.sort_order),
      fixed: accounts
        .filter((a) => a.account_type === 'fixed')
        .sort((a, b) => a.sort_order - b.sort_order),
      cash: accounts
        .filter((a) => a.account_type === 'cash')
        .sort((a, b) => a.sort_order - b.sort_order),
    };
  }, [savingsAccounts]);

  const totals = useMemo(() => {
    const allAccounts = savingsAccounts.savings_accounts || [];
    return {
      total: allAccounts.reduce((sum, a) => sum + (a.accumulated || 0), 0),
      monthly: allAccounts.reduce((sum, a) => sum + (a.monthly_amount || 0), 0),
      fixed: groupedSavings.fixed.reduce((sum, a) => sum + (a.accumulated || 0), 0),
      cash: groupedSavings.cash.reduce((sum, a) => sum + (a.accumulated || 0), 0),
    };
  }, [savingsAccounts, groupedSavings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="טוען חסכונות..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage
          error={error}
          title="שגיאה בטעינת חסכונות"
          onRetry={reloadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">סיכום חסכונות</h2>
        <p className="text-slate-600 mt-1">מצב כל החסכונות וההשקעות</p>
      </div>

      {/* Summary Cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="סיכום כללי"
      >
        <SummaryCard
          label="סה״כ חסכונות"
          value={totals.total}
          icon="savings"
          colorClass="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="הפקדות חודשיות"
          value={totals.monthly}
          icon="event_repeat"
          colorClass="bg-emerald-100 text-emerald-600"
        />
        <SummaryCard
          label="קרנות השתלמות"
          value={totals.fixed}
          icon="account_balance"
          colorClass="bg-violet-100 text-violet-600"
        />
        <SummaryCard
          label="נזילות (עו״ש)"
          value={totals.cash}
          icon="wallet"
          colorClass="bg-amber-100 text-amber-600"
        />
      </section>

      {/* Savings Tables */}
      <div className="space-y-6">
        <SavingsTable
          title={SAVINGS_ACCOUNT_TYPES.monthly.label}
          description={SAVINGS_ACCOUNT_TYPES.monthly.description}
          accounts={groupedSavings.monthly}
          showMonthly
        />

        <SavingsTable
          title={SAVINGS_ACCOUNT_TYPES.fixed.label}
          description={SAVINGS_ACCOUNT_TYPES.fixed.description}
          accounts={groupedSavings.fixed}
        />

        <SavingsTable
          title={SAVINGS_ACCOUNT_TYPES.cash.label}
          description={SAVINGS_ACCOUNT_TYPES.cash.description}
          accounts={groupedSavings.cash}
        />
      </div>
    </div>
  );
};

export default SavingsView;
