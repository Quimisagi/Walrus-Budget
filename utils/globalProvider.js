import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [activeBudget, setActiveBudget] = useState({}); 
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeBudgetTransactions, setActiveBudgetTransactions] = useState([]);
  const [activeBudgetCategories, setActiveBudgetCategories] = useState([]);

  const globalState = {
    theme,
    setTheme,
    budgets,
    setBudgets,
    transactions,
    setTransactions,
    categories,
    setCategories,
    activeBudget,
    setActiveBudget,
    accounts,
    setAccounts,
    activeBudgetTransactions,
    setActiveBudgetTransactions,
    activeBudgetCategories,
    setActiveBudgetCategories,
  };
  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
