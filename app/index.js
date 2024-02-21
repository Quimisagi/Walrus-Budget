import React, { useCallback, useEffect, useState } from 'react';
import { Stack, useNavigation, router } from 'expo-router';
import { Text, Button, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useGlobal } from '../utils/globalProvider';
import { deleteAllData, getData, storeData } from '../utils/storage';
import { setupCategories } from '../utils/numberUtils';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [appIsReady, setAppIsReady] = useState(false);
  const navigation = useNavigation();

  const { budgets, setBudgets, transactions, setTransactions, activeBudget, setActiveBudget} = useGlobal();

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  const calculateBalance = (balance, transactions) => {
    transactions.forEach(transaction => {
      balance += transaction.amount * transaction.transactionType;
    });
    return balance;
  }

  const calculateExpenses = (transactions) => {
    let expenses = 0;
    transactions.forEach(transaction => {
      if (transaction.transactionType === -1) {
        expenses += transaction.amount;
      }
    });
    return expenses;
  }
  const calculateIncome = (transactions) => {
    let income = 0;
    transactions.forEach(transaction => {
      if (transaction.transactionType === 1) {
        income += transaction.amount;
      }
    }
    );
    return income;
  }


  useEffect(() => {
    navigation.setOptions({headerShown: false});
    async function prepare() {
      try {
        let activeBudgetTemp = {};
        let transactionsTemp = [];
        await getData('activeBudget')
          .then(activeBudget => {
            if(activeBudget) setActiveBudget(JSON.parse(activeBudget));
            else setActiveBudget({});
            activeBudgetTemp = JSON.parse(activeBudget);
          })
          .catch(error => {
          });

        await getData('budgets')
          .then(budgets => {
            if(budgets){
              budgets = JSON.parse(budgets);
              setBudgets(budgets);
              budgetsTemp = budgets;
            }
            else{ 
              setBudgets([]);
              budgetsTemp = [];
            } 
          })
          .catch(error => {
          });

        await getData('transactions')
          .then(transactions => {
            if(transactions){
              transactions = JSON.parse(transactions);
              setTransactions(transactions);
              transactionsTemp = transactions;
            }
            else{
              setTransactions([]);
              transactionsTemp = [];
            }
          })
          .catch(error => {
          });
        if(activeBudgetTemp) {
          let filtered = transactionsTemp.filter(transaction => transaction.budgetId === activeBudgetTemp.id);
          setFilteredTransactions(filtered);
          setExpenses(calculateExpenses(filtered));
          setIncome(calculateIncome(filtered));
          setBalance(calculateBalance(activeBudgetTemp.begginingBalance, filtered));
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
        router.replace('/home');
      }
    }
    prepare();
  }, [navigation]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      router.replace('/home');
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

}
