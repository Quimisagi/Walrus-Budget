export const processMoneyValue = (text) => {
  if (text[0] === "$") {
    text = text.slice(1);
  }
  text.replace(/[^0-9]/g, '')
  if (isNaN(parseFloat(text))) {
    return 0;
  } else {
    return parseFloat(text);
  }
};

export const calculatePercentage = (spent, budgeted) => {
  if (budgeted === 0) return 0;
  const remaining = budgeted + spent;
  const percentage = (remaining / budgeted) * 100;
  return Math.max(0, Math.min(100, Math.round(percentage))); // Clamp to [0, 100]
}

export const calculateCategoryTotalSpent = (categoryId, transactions) => {
  if (!transactions) return 0;
  let totalSpent = 0;
  transactions.map(transaction => {
    if (transaction.categoryId === categoryId) {
      totalSpent += transaction.amount * transaction.transactionType;
    }
  });
  return totalSpent;
}

export const calculateExpenses = (transactions) => {
  if (!transactions) return 0;
  let totalSpent = 0;
  transactions.map(transaction => {
    if (transaction.transactionType === -1) {
      totalSpent += transaction.amount;
    }
  });
  return totalSpent;
}

export const calculateIncome = (transactions) => {
  if (!transactions) return 0;
  let totalIncome = 0;
  transactions.map(transaction => {
    if (transaction.transactionType === 1) {
      totalIncome += transaction.amount;
    }
  });
  return totalIncome;
}

export const setupCategories = (categories, transactions) => {
  if(!categories) return;
  categories.map(category => {
    category.totalSpent = calculateCategoryTotalSpent(category.categoryId, transactions);
  }
  );
  return categories;
}

export const calculateBudgetedInCategories = (categories) => {
  if(!categories) return;
  let totalBudgeted = 0;
  categories.map(category => {
    totalBudgeted += category.amount;
  });
  return totalBudgeted;
}

export const formatMoney = (text) => {
  // Remove any non-numeric characters except for the decimal point
  const cleanedText = text.replace(/(?!^-)[^0-9.]/g, '');

  // Convert to a number and format with commas
  const value = parseFloat(cleanedText) || 0;
  return value.toLocaleString(); // Format the number with commas
};

