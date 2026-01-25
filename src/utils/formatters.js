/**
 * Format amount as Israeli Shekel currency
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @returns {string}
 */
export function formatCurrency(amount, options = {}) {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSign = false,
  } = options;

  const formatter = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(amount);

  if (showSign && amount > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Format number with Hebrew locale
 * @param {number} num - The number to format
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat('he-IL').format(num);
}

/**
 * Format percentage value
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places
 * @param {boolean} showSign - Whether to show + for positive values
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1, showSign = true) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a compact number (e.g., 1.5K, 2.3M)
 * @param {number} num - The number to format
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat('he-IL', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) {
    return '';
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', defaultOptions).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format relative time (e.g., "לפני 3 שעות")
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export function formatRelativeTime(dateString) {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'עכשיו';
    }
    if (diffMins < 60) {
      return `לפני ${diffMins} דקות`;
    }
    if (diffHours < 24) {
      return `לפני ${diffHours} שעות`;
    }
    if (diffDays < 7) {
      return `לפני ${diffDays} ימים`;
    }

    return formatDate(dateString);
  } catch {
    return dateString;
  }
}
