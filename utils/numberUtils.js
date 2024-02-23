export const processMoneyValue = (text) => {
  if (text[0] === "$") {
    text = text.slice(1);
  }
  if (isNaN(parseFloat(text))) {
    return 0;
  } else {
    return parseFloat(text);
  }
};

export const calculatePercentage = (spent, budgeted) => {
  if(budgeted === 0) return 0;
  return Math.round((spent / budgeted) * 100);
}

export const calculateCategoryTotalSpent = (categoryId, transactions) => {
  if (!transactions) return 0;
  let totalSpent = 0;
  transactions.map(transaction => {
    if (transaction.allocatedCategoryId === categoryId) {
      totalSpent += transaction.amount;
    }
  });
  return totalSpent;
}

export const setupCategories = (categories, transactions) => {
  if(!categories) return;
  categories.map(category => {
    category.totalSpent = calculateCategoryTotalSpent(category.categoryId, transactions);
  }
  );
  return categories;
}

