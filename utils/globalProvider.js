import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../app/i18n'; // Import i18n instance

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
  const [isSwiping, setIsSwiping] = useState(false);
  const [currency, setCurrencyState] = useState('USD'); // Renamed to avoid conflict
  const [language, setLanguageState] = useState('en'); // Renamed to avoid conflict

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguageState(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedCurrency) {
          setCurrencyState(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load data from storage', error);
      }
    };
    loadStoredData();
  }, []);

  const updateLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to save language to storage', error);
    }
  };

  const updateCurrency = async (curr) => {
    try {
      await AsyncStorage.setItem('currency', curr);
      setCurrencyState(curr);
    } catch (error) {
      console.error('Failed to save currency to storage', error);
    }
  };

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
    isSwiping,
    setIsSwiping,
    currency: currency, // Expose currency state
    setCurrency: updateCurrency, // Expose currency update function
    language: language, // Expose language state
    setLanguage: updateLanguage, // Expose language update function
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
