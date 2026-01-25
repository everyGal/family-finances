export const hebrewMonths = {
  '01': 'ינו',
  '02': 'פבר',
  '03': 'מרץ',
  '04': 'אפר',
  '05': 'מאי',
  '06': 'יונ',
  '07': 'יול',
  '08': 'אוג',
  '09': 'ספט',
  '10': 'אוק',
  '11': 'נוב',
  '12': 'דצמ',
};

export const hebrewMonthsFull = {
  '01': 'ינואר',
  '02': 'פברואר',
  '03': 'מרץ',
  '04': 'אפריל',
  '05': 'מאי',
  '06': 'יוני',
  '07': 'יולי',
  '08': 'אוגוסט',
  '09': 'ספטמבר',
  '10': 'אוקטובר',
  '11': 'נובמבר',
  '12': 'דצמבר',
};

/**
 * Format a month string to Hebrew short format
 * @param {string} monthString - Format: "YYYY-MM"
 * @returns {string} Format: "MMM-YY" (e.g., "ינו-24")
 */
export function formatMonthHebrew(monthString) {
  if (!monthString || typeof monthString !== 'string') {
    return '';
  }
  const [year, month] = monthString.split('-');
  const shortYear = year?.slice(-2) || '';
  return `${hebrewMonths[month] || month}-${shortYear}`;
}

/**
 * Format a month string to Hebrew full format
 * @param {string} monthString - Format: "YYYY-MM"
 * @returns {string} Format: "MMMM YYYY" (e.g., "ינואר 2024")
 */
export function formatMonthHebrewFull(monthString) {
  if (!monthString || typeof monthString !== 'string') {
    return '';
  }
  const [year, month] = monthString.split('-');
  return `${hebrewMonthsFull[month] || month} ${year}`;
}

/**
 * Get current month in YYYY-MM format
 * @returns {string}
 */
export function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get current year
 * @returns {number}
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Parse month string to date object
 * @param {string} monthString - Format: "YYYY-MM"
 * @returns {Date}
 */
export function parseMonthString(monthString) {
  const [year, month] = monthString.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Get previous month string
 * @param {string} monthString - Format: "YYYY-MM"
 * @returns {string}
 */
export function getPreviousMonth(monthString) {
  const date = parseMonthString(monthString);
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get next month string
 * @param {string} monthString - Format: "YYYY-MM"
 * @returns {string}
 */
export function getNextMonth(monthString) {
  const date = parseMonthString(monthString);
  date.setMonth(date.getMonth() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get all unique years from months array
 * @param {Array} months - Array of month objects with month property
 * @returns {Array<number>}
 */
export function getYearsFromMonths(months) {
  const years = new Set(months.map((m) => m.year || parseInt(m.month?.split('-')[0])));
  return Array.from(years).sort((a, b) => b - a);
}
