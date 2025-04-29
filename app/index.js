import React, { useCallback, useEffect, useState } from 'react';
import { Stack, useNavigation, router } from 'expo-router';
import { Text, Button, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useGlobal } from '../utils/globalProvider';
import { deleteAllData, getData, storeData } from '../utils/storage';
import { setupCategories } from '../utils/numberUtils';
import 'react-native-gesture-handler';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [appIsReady, setAppIsReady] = useState(false);
  const navigation = useNavigation();

  const {
    activeBudget,
    setBudgets, 
    transactions,
    setTransactions,
    setActiveBudget,
    setAccounts,
    categories,
    setCategories,
    setActiveBudgetTransactions,
    setActiveBudgetCategories,
    setCurrency,
  } = useGlobal();


  useEffect(() => {
    navigation.setOptions({headerShown: false});
    async function prepare() {
      try {
        await getData('currency')
          .then(currency => {
            if(currency) setCurrency(currency);
            else setCurrency('USD');
          });
        await getData('activeBudget')
          .then(activeBudget => {
            if(activeBudget) setActiveBudget(JSON.parse(activeBudget));
            else setActiveBudget({});
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
            }
            else{
              setTransactions([]);
            }
          })
          .catch(error => {
          });
        await getData('categories')
          .then(categories => {
            if(categories){
              categories = JSON.parse(categories);
              setCategories(categories);
            }
            else{
              setCategories([]);
            }
          })
          .catch(error => {
          });
        await getData('accounts')
          .then(accounts => {
            if(accounts){
              accounts = JSON.parse(accounts);
              setAccounts(accounts);
            }
            else{
              setAccounts([]);
            }
          })
          .catch(error => {
          });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
        if(budgetsTemp.length === 0){
          router.replace('/welcomeScreen');
        }
        else
          // router.replace('/welcomeScreen');
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
