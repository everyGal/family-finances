import { useState, useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { getYearsFromMonths } from '@/utils/dateHelpers';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorMessage from '@/components/Common/ErrorMessage';
import SummaryCards from './SummaryCards';
import MonthlyTable from './MonthlyTable';
import YoYTable from './YoYTable';
import FilterBar from './FilterBar';
import Charts from './Charts';

const Dashboard = () => {
  const { state, reloadData } = useBudget();

  const years = useMemo(
    () => getYearsFromMonths(state.monthlyBudget?.months || []),
    [state.monthlyBudget?.months]
  );

  const [selectedYear, setSelectedYear] = useState(() => years[0] || new Date().getFullYear());
  const [yoyEnabled, setYoyEnabled] = useState(false);

  const availableMonths = useMemo(() => {
    const months = (state.monthlyBudget?.months || [])
      .filter((m) => m.year === selectedYear || m.month?.startsWith(String(selectedYear)))
      .map((m) => m.month?.split('-')[1])
      .filter(Boolean);
    return [...new Set(months)].sort();
  }, [state.monthlyBudget?.months, selectedYear]);

  const [selectedMonths, setSelectedMonths] = useState(() => availableMonths);

  // When year changes, reset month selection
  const handleYearChange = (year) => {
    setSelectedYear(year);
    const months = (state.monthlyBudget?.months || [])
      .filter((m) => m.year === year || m.month?.startsWith(String(year)))
      .map((m) => m.month?.split('-')[1])
      .filter(Boolean);
    setSelectedMonths([...new Set(months)].sort());
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="טוען נתונים..." />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage
          error={state.error}
          title="שגיאה בטעינת נתונים"
          onRetry={reloadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SummaryCards />
      <FilterBar
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        selectedMonths={selectedMonths}
        onMonthsChange={setSelectedMonths}
        yoyEnabled={yoyEnabled}
        onYoyToggle={() => setYoyEnabled((prev) => !prev)}
      />
      {yoyEnabled ? (
        <YoYTable selectedYear={selectedYear} selectedMonths={selectedMonths} />
      ) : (
        <MonthlyTable selectedYear={selectedYear} selectedMonths={selectedMonths} />
      )}
      <Charts />
    </div>
  );
};

export default Dashboard;
