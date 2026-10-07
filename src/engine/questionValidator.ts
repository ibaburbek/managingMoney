export function cleanNumber(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function normalizeAnswer(input: string | number): string {
  if (typeof input === 'number') {
    return cleanNumber(input).toString();
  }
  
  let s = input.trim().toLowerCase();
  
  // Remove currency signs and commas
  s = s.replace(/[\$,]/g, '');
  // Remove "dollars", "usd", "cents"
  s = s.replace(/\s*(dollars|dollar|usd|cents|cent)/g, '');
  
  // Check if ending with '%'
  const hasPercent = s.endsWith('%');
  if (hasPercent) {
    s = s.replace('%', '').trim();
  }

  // Parse as float if valid number
  const num = parseFloat(s);
  if (!isNaN(num)) {
    const cleaned = cleanNumber(num);
    return hasPercent ? `${cleaned}%` : cleaned.toString();
  }

  // For words (e.g. true/false, option letters 'a', 'b', 'c', 'd')
  return s;
}

export function isAnswerCorrect(
  userAnswer: string | number,
  correctAnswer: string | number,
  acceptableAnswers?: (string | number)[],
  unit?: string
): boolean {
  const normUser = normalizeAnswer(userAnswer);
  const normCorrect = normalizeAnswer(correctAnswer);

  if (normUser === normCorrect) {
    return true;
  }

  // If unit is '%' and user gave just the number (e.g. 15 instead of 15% or vice-versa)
  if (unit === '%' || normCorrect.endsWith('%')) {
    const rawCorrectNum = normCorrect.replace('%', '');
    const rawUserNum = normUser.replace('%', '');
    if (rawUserNum === rawCorrectNum) {
      return true;
    }
  }

  // Check acceptable answers
  if (acceptableAnswers && acceptableAnswers.length > 0) {
    for (const alt of acceptableAnswers) {
      if (normUser === normalizeAnswer(alt)) {
        return true;
      }
    }
  }

  // Float comparison within 0.01 tolerance for monetary rounding
  const numUser = parseFloat(normUser);
  const numCorrect = parseFloat(normCorrect);
  if (!isNaN(numUser) && !isNaN(numCorrect)) {
    if (Math.abs(numUser - numCorrect) <= 0.01) {
      return true;
    }
  }

  return false;
}
