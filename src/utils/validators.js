/**
 * Validate month string format
 * @param {string} monthString - Expected format: "YYYY-MM"
 * @returns {boolean}
 */
export function isValidMonthString(monthString) {
  if (!monthString || typeof monthString !== 'string') {
    return false;
  }

  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(monthString);
}

/**
 * Validate amount (non-negative number)
 * @param {*} value - Value to validate
 * @returns {boolean}
 */
export function isValidAmount(value) {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate monthly budget data structure
 * @param {Object} data - Monthly budget data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMonthlyBudget(data) {
  const errors = [];

  if (!data) {
    errors.push('נתונים חסרים');
    return { valid: false, errors };
  }

  if (!data.months || !Array.isArray(data.months)) {
    errors.push('מערך חודשים חסר או לא תקין');
    return { valid: false, errors };
  }

  data.months.forEach((month, index) => {
    if (!isValidMonthString(month.month)) {
      errors.push(`חודש ${index + 1}: פורמט תאריך לא תקין`);
    }

    if (month.expenses) {
      Object.entries(month.expenses).forEach(([key, value]) => {
        if (!isValidAmount(value)) {
          errors.push(`חודש ${month.month}: סכום הוצאה לא תקין עבור ${key}`);
        }
      });
    }

    if (month.income) {
      Object.entries(month.income).forEach(([key, value]) => {
        if (!isValidAmount(value)) {
          errors.push(`חודש ${month.month}: סכום הכנסה לא תקין עבור ${key}`);
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate savings accounts data structure
 * @param {Object} data - Savings accounts data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSavingsAccounts(data) {
  const errors = [];

  if (!data) {
    errors.push('נתונים חסרים');
    return { valid: false, errors };
  }

  if (!data.savings_accounts || !Array.isArray(data.savings_accounts)) {
    errors.push('מערך חסכונות חסר או לא תקין');
    return { valid: false, errors };
  }

  data.savings_accounts.forEach((account) => {
    if (!account.id) {
      errors.push('חשבון חסר מזהה');
    }

    if (!account.account_name) {
      errors.push(`חשבון ${account.id || 'לא ידוע'}: שם חסר`);
    }

    if (!isValidAmount(account.accumulated)) {
      errors.push(`חשבון ${account.account_name || account.id}: סכום צבירה לא תקין`);
    }

    if (account.monthly_amount !== undefined && !isValidAmount(account.monthly_amount)) {
      errors.push(`חשבון ${account.account_name || account.id}: סכום חודשי לא תקין`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate JSON file before import
 * @param {File} file - File object
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function validateJsonFile(file) {
  if (!file) {
    return { valid: false, error: 'לא נבחר קובץ' };
  }

  if (!file.name.endsWith('.json')) {
    return { valid: false, error: 'רק קבצי JSON מותרים' };
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { valid: false, error: 'הקובץ גדול מדי (מקסימום 5MB)' };
  }

  try {
    const text = await file.text();
    JSON.parse(text);
    return { valid: true };
  } catch {
    return { valid: false, error: 'קובץ JSON לא תקין' };
  }
}

/**
 * Validate category data
 * @param {Object} category - Category object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCategory(category) {
  const errors = [];

  if (!category.id) {
    errors.push('מזהה קטגוריה חסר');
  }

  if (!category.name_hebrew) {
    errors.push('שם קטגוריה בעברית חסר');
  }

  if (!['income', 'expense'].includes(category.type)) {
    errors.push('סוג קטגוריה לא תקין (חייב להיות income או expense)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
