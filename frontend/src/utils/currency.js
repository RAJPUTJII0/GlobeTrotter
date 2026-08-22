export const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'د.إ', AUD: 'A$' };

export function formatMoney(value, currency = 'INR') {
  const amount = Number(value || 0);
  return `${CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.INR}${amount.toFixed(2)}`;
}
