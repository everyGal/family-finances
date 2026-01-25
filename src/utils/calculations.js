/**
 * Calculate total expenses from expenses object
 * @param {Object} expenses - Object with expense category values
 * @returns {number}
 */
export function calculateTotalExpenses(expenses) {
  if (!expenses || typeof expenses !== 'object') {
    return 0;
  }
  return Object.values(expenses).reduce((sum, val) => sum + (Number(val) || 0), 0);
}

/**
 * Calculate total income from income object
 * @param {Object} income - Object with income category values
 * @returns {number}
 */
export function calculateTotalIncome(income) {
  if (!income || typeof income !== 'object') {
    return 0;
  }
  return Object.values(income).reduce((sum, val) => sum + (Number(val) || 0), 0);
}

/**
 * Calculate surplus (income - expenses) for a month
 * @param {Object} month - Month object with income and expenses
 * @returns {number}
 */
export function calculateSurplus(month) {
  if (!month) {
    return 0;
  }
  const totalIncome = calculateTotalIncome(month.income);
  const totalExpenses = calculateTotalExpenses(month.expenses);
  return totalIncome - totalExpenses;
}

/**
 * Calculate percentage change between current and previous values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Get monthly average for a specific field
 * @param {Array} months - Array of month objects
 * @param {string} type - 'income' or 'expenses'
 * @param {string} field - Field name (optional, for specific category)
 * @returns {number}
 */
export function getMonthlyAverage(months, type, field = null) {
  if (!months || months.length === 0) {
    return 0;
  }

  const values = months.map((m) => {
    if (field) {
      return m[type]?.[field] || 0;
    }
    return type === 'income'
      ? calculateTotalIncome(m.income)
      : calculateTotalExpenses(m.expenses);
  });

  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

/**
 * Calculate savings rate (surplus / income * 100)
 * @param {Object} month - Month object with income and expenses
 * @returns {number} Savings rate percentage
 */
export function calculateSavingsRate(month) {
  const income = calculateTotalIncome(month?.income);
  if (income === 0) {
    return 0;
  }
  const surplus = calculateSurplus(month);
  return (surplus / income) * 100;
}

/**
 * Get year-to-date totals
 * @param {Array} months - Array of month objects
 * @param {number} year - Year to calculate for
 * @returns {Object} { totalIncome, totalExpenses, totalSurplus, averageMonthly }
 */
export function getYearToDateTotals(months, year) {
  const yearMonths = months.filter((m) => m.year === year || m.month?.startsWith(String(year)));

  const totals = yearMonths.reduce(
    (acc, month) => {
      acc.totalIncome += calculateTotalIncome(month.income);
      acc.totalExpenses += calculateTotalExpenses(month.expenses);
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  return {
    ...totals,
    totalSurplus: totals.totalIncome - totals.totalExpenses,
    averageMonthlyIncome: yearMonths.length > 0 ? totals.totalIncome / yearMonths.length : 0,
    averageMonthlyExpenses: yearMonths.length > 0 ? totals.totalExpenses / yearMonths.length : 0,
    monthCount: yearMonths.length,
  };
}

/**
 * Calculate total accumulated savings
 * @param {Array} accounts - Array of savings account objects
 * @returns {number}
 */
export function calculateTotalSavings(accounts) {
  if (!accounts || !Array.isArray(accounts)) {
    return 0;
  }
  return accounts.reduce((sum, account) => sum + (account.accumulated || 0), 0);
}

/**
 * Calculate total monthly savings contributions
 * @param {Array} accounts - Array of savings account objects
 * @returns {number}
 */
export function calculateMonthlySavingsContributions(accounts) {
  if (!accounts || !Array.isArray(accounts)) {
    return 0;
  }
  return accounts.reduce((sum, account) => sum + (account.monthly_amount || 0), 0);
}
