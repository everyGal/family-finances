import { useState, useCallback, useRef } from 'react';
import { useBudget } from '@/context/BudgetContext';
import {
  validateJsonFile,
  validateMonthlyBudget,
  validateSavingsAccounts,
} from '@/utils/validators';

const ImportData = ({ onClose }) => {
  const { state, dispatch } = useBudget();
  const [dragActive, setDragActive] = useState(false);
  const [importData, setImportData] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file) => {
    setError(null);
    setImportData(null);
    setDataType(null);

    // Validate file
    const validation = await validateJsonFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Detect data type
      if (data.months && Array.isArray(data.months)) {
        setDataType('monthly');
        const budgetValidation = validateMonthlyBudget(data);
        if (!budgetValidation.valid) {
          setError(budgetValidation.errors.join(', '));
          return;
        }
      } else if (data.savings_accounts && Array.isArray(data.savings_accounts)) {
        setDataType('savings');
        const savingsValidation = validateSavingsAccounts(data);
        if (!savingsValidation.valid) {
          setError(savingsValidation.errors.join(', '));
          return;
        }
      } else {
        setError('פורמט קובץ לא מזוהה. נדרש קובץ עם מערך months או savings_accounts');
        return;
      }

      setImportData(data);
    } catch (err) {
      setError('שגיאה בקריאת הקובץ: ' + err.message);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!importData) return;

    setImporting(true);

    try {
      if (dataType === 'monthly') {
        // Import monthly budget data
        importData.months.forEach((newMonth) => {
          dispatch({ type: 'ADD_MONTH', payload: newMonth });
        });
      } else if (dataType === 'savings') {
        // Import savings data
        dispatch({ type: 'UPDATE_SAVINGS', payload: importData });
      }

      // Close modal after successful import
      setTimeout(() => {
        setImporting(false);
        onClose();
      }, 500);
    } catch (err) {
      setError('שגיאה בייבוא: ' + err.message);
      setImporting(false);
    }
  };

  const resetImport = () => {
    setImportData(null);
    setDataType(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSummary = () => {
    if (!importData) return null;

    if (dataType === 'monthly') {
      const existingMonths = state.monthlyBudget.months.map((m) => m.month);
      const newMonths = importData.months.filter(
        (m) => !existingMonths.includes(m.month)
      );
      const updateMonths = importData.months.filter((m) =>
        existingMonths.includes(m.month)
      );

      return {
        total: importData.months.length,
        new: newMonths.length,
        update: updateMonths.length,
      };
    }

    if (dataType === 'savings') {
      return {
        accounts: importData.savings_accounts.length,
      };
    }

    return null;
  };

  const summary = getSummary();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-dialog-title"
    >
      <div
        className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              id="import-dialog-title"
              className="text-2xl font-bold text-slate-900"
            >
              ייבוא נתונים
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              ייבוא קבצי JSON מ-n8n או מקורות אחרים
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Upload Area or Preview */}
        {!importData ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <span
              className="material-symbols-outlined text-6xl text-slate-400 mb-4 block"
              aria-hidden="true"
            >
              cloud_upload
            </span>
            <p className="text-lg font-medium text-slate-700 mb-2">
              גרור ושחרר קובץ JSON כאן
            </p>
            <p className="text-sm text-slate-500 mb-4">או</p>
            <label className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-primary/90 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              בחר קובץ
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-slate-400 mt-4">
              תומך בקבצי monthly_budget.json ו-savings_accounts.json
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success Message */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl">
                  check_circle
                </span>
                <div>
                  <p className="text-emerald-800 font-medium">קובץ נטען בהצלחה</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    {dataType === 'monthly'
                      ? `נמצאו ${summary?.total} חודשים (${summary?.new} חדשים, ${summary?.update} עדכונים)`
                      : `נמצאו ${summary?.accounts} חשבונות חיסכון`}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Details */}
            {dataType === 'monthly' && importData.months && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-bold text-slate-900 mb-2">חודשים בייבוא:</h4>
                <div className="flex flex-wrap gap-2">
                  {importData.months.map((m) => (
                    <span
                      key={m.month}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        state.monthlyBudget.months.some((em) => em.month === m.month)
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {m.month_hebrew}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <span className="inline-block w-3 h-3 bg-emerald-100 rounded mr-1"></span>
                  חדש
                  <span className="inline-block w-3 h-3 bg-amber-100 rounded mr-3 ml-1"></span>
                  עדכון
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={resetImport}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                בחר קובץ אחר
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={importing}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    מייבא...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      file_download
                    </span>
                    אישור ייבוא
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl">
                error
              </span>
              <div>
                <p className="text-red-800 font-medium">שגיאה</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportData;
