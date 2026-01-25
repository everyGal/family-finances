import { useState } from 'react';
import { BudgetProvider } from '@/context/BudgetContext';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Dashboard from '@/components/Dashboard/Dashboard';
import SavingsView from '@/components/Savings/SavingsView';
import ImportData from '@/components/Import/ImportData';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showImport, setShowImport] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    alert('שמירה בוצעה בהצלחה!');
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('ייצוא PDF - יופעל בקרוב');
  };

  const handleAddExpense = () => {
    // TODO: Open add expense modal
    alert('הוספת הוצאה - יופעל בקרוב');
  };

  const handleUpdateIncome = () => {
    // TODO: Open update income modal
    alert('עדכון הכנסה - יופעל בקרוב');
  };

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-background-light">
        <Header
          activeView={activeView}
          onViewChange={setActiveView}
          onImportClick={() => setShowImport(true)}
          onSaveClick={handleSave}
        />

        <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 pb-24">
          {activeView === 'dashboard' && <Dashboard />}

          {activeView === 'savings' && <SavingsView />}

          {activeView === 'reports' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
              <p>דוחות יופיעו כאן</p>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">settings</span>
              <p>הגדרות יופיעו כאן</p>
            </div>
          )}
        </main>

        <Footer
          onAddExpense={handleAddExpense}
          onUpdateIncome={handleUpdateIncome}
          onExportPDF={handleExportPDF}
        />

        {showImport && <ImportData onClose={() => setShowImport(false)} />}
      </div>
    </BudgetProvider>
  );
};

export default App;
