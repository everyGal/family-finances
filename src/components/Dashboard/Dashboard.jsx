import { useBudget } from '@/context/BudgetContext';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorMessage from '@/components/Common/ErrorMessage';
import SummaryCards from './SummaryCards';
import MonthlyTable from './MonthlyTable';
import Charts from './Charts';

const Dashboard = () => {
  const { state, reloadData } = useBudget();

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
      <MonthlyTable />
      <Charts />
    </div>
  );
};

export default Dashboard;
