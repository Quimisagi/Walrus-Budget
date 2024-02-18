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
  return Math.round((spent / budgeted) * 100);
}

