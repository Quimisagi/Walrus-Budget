import { Stack } from 'expo-router/stack';
import { Text, TouchableOpacity } from 'react-native';

import React, { createContext, useContext, useState } from 'react';

// Create a context to hold global state
const GlobalContext = createContext();

// Create a provider component that wraps the entire app
export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [activeBudget, setActiveBudget] = useState({}); 
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // You can define other global state and functions here

  const globalState = {
    theme,
    setTheme,
    budgets,
    setBudgets,
    transactions,
    setTransactions,
    activeBudget,
    setActiveBudget
  };
  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to easily access the global state anywhere in the app
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};


export default function Layout() {
  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#AED1D6',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen 
          name="budgetForm"
          options={{ headerTitle: 'New budget',
          }}
        />
        <Stack.Screen
          name="transactionsForm"
          options={{ headerTitle: 'New transaction' }}
        />
        <Stack.Screen
          name="budgetsList"
          options={{ headerTitle: 'Budgets' }}
        />
        <Stack.Screen
          name="categoryForm"
          options={{ headerTitle: 'New category' }}
        />
        <Stack.Screen
          name="allocatedCategoryDetails"
          options={{ headerTitle: 'Category details' }}
        />
      </Stack>
    </GlobalProvider>
  );
}

