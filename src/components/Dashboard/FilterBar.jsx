import { useState, useRef, useEffect, useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { getYearsFromMonths } from '@/utils/dateHelpers';
import { hebrewMonthsFull } from '@/utils/dateHelpers';

const FilterBar = ({ selectedYear, onYearChange, selectedMonths, onMonthsChange, yoyEnabled, onYoyToggle }) => {
  const { state } = useBudget();
  const { monthlyBudget } = state;
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const years = useMemo(
    () => getYearsFromMonths(monthlyBudget.months || []),
    [monthlyBudget.months]
  );

  const availableMonthNumbers = useMemo(() => {
    const months = (monthlyBudget.months || [])
      .filter((m) => m.year === selectedYear || m.month?.startsWith(String(selectedYear)))
      .map((m) => m.month?.split('-')[1])
      .filter(Boolean);
    return [...new Set(months)].sort();
  }, [monthlyBudget.months, selectedYear]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMonthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMonth = (monthNum) => {
    if (selectedMonths.includes(monthNum)) {
      if (selectedMonths.length > 1) {
        onMonthsChange(selectedMonths.filter((m) => m !== monthNum));
      }
    } else {
      onMonthsChange([...selectedMonths, monthNum].sort());
    }
  };

  const selectAllMonths = () => {
    onMonthsChange(availableMonthNumbers);
  };

  const resetFilters = () => {
    if (years.length > 0) {
      onYearChange(years[0]);
    }
    onMonthsChange(availableMonthNumbers);
    if (yoyEnabled) {
      onYoyToggle();
    }
  };

  const monthLabel = selectedMonths.length === availableMonthNumbers.length
    ? `כל החודשים (${selectedMonths.length} נבחרו)`
    : `${selectedMonths.length} חודשים נבחרו`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex flex-wrap items-center gap-6">
        {/* Year Selector */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-semibold text-slate-500 text-right">בחר שנה</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pr-3 pl-8 py-2 focus:ring-2 focus:ring-primary outline-none text-sm text-right"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute left-2 top-2 text-slate-400 pointer-events-none text-lg">
              expand_more
            </span>
          </div>
        </div>

        {/* Month Multi-Select */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-500 text-right">בחר חודשים</label>
          <div className="relative">
            <button
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className="flex items-center justify-between w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-400 text-lg">filter_list</span>
              <span className="text-slate-600">{monthLabel}</span>
            </button>
            {monthDropdownOpen && (
              <div className="absolute z-30 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-2 max-h-[240px] overflow-y-auto">
                <button
                  onClick={selectAllMonths}
                  className="w-full text-right text-xs text-primary font-semibold px-2 py-1 hover:bg-blue-50 rounded mb-1"
                >
                  בחר הכל
                </button>
                {availableMonthNumbers.map((num) => (
                  <label
                    key={num}
                    className="flex items-center justify-end gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-sm"
                  >
                    <span>{hebrewMonthsFull[num]}</span>
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(num)}
                      onChange={() => toggleMonth(num)}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* YoY Toggle */}
        <div className={`flex items-center gap-3 self-end h-[42px] px-4 border rounded-lg ${
          yoyEnabled
            ? 'bg-blue-50 border-blue-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-sm font-semibold">השוואה שנתית (YoY)</span>
          <button
            onClick={onYoyToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              yoyEnabled ? 'bg-primary' : 'bg-slate-300'
            }`}
            aria-label="הפעל השוואה שנתית"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
              yoyEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="self-end h-[42px] px-4 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          איפוס פילטרים
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
