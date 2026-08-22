export const calculateTotal = (expenses = []) => expenses.reduce((total, item) => total + Number(item.amount || 0), 0);
