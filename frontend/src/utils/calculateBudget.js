export const calculateBudget = (expenses = []) => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
