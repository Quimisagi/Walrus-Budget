import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobal } from '../../utils/globalProvider';
import globalStyles from '../../utils/globalStyles';
import CategoryModal from '../components/categoryModal';
import { router } from 'expo-router';
import CategoriesList from '../components/categoriesList';
import TransactionList from '../components/transactionsList';
import { Ionicons, Feather } from '@expo/vector-icons';
import { displayDateInFormat } from '../../utils/dateUtils';
import { calculateExpenses, calculateIncome } from '../../utils/numberUtils';


import * as Font from 'expo-font';

Font.loadAsync({
  'PlusJakarta': require('../../assets/fonts/PlusJakartaSans.ttf'),
});


export default function Home() {
  const navigation = useNavigation();

  const { 
    budgets,
    transactions,
    categories,
    activeBudget,
    activeBudgetTransactions,
    setActiveBudgetTransactions,
    activeBudgetCategories,
    setActiveBudgetCategories,
    isSwiping,
    setIsSwiping,
  } = useGlobal();

  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);

  const calculateBalance = (balance, transactions) => {
    transactions.forEach(transaction => {
      balance += transaction.amount * transaction.transactionType;
    });
    return balance;
  }

  const toAddCategory = (category ) => {
    router.push({ pathname: '/categoryForm', params: { categoryId: category.id, activeBudgetId: activeBudgetId } });
    setModalVisible(false);
  }
  useEffect(() => {
    navigation.setOptions({headerShown: false });
  }, []);

  useEffect(() => {
    if(activeBudget){
      setExpenses(calculateExpenses(activeBudgetTransactions));
      setIncome(calculateIncome(activeBudgetTransactions));
      setBalance(calculateBalance(activeBudget.begginingBalance, activeBudgetTransactions));
    } 
  }, [activeBudget, budgets, transactions, activeBudgetTransactions]);

  useEffect(() => {
    if(activeBudget){
      setActiveBudgetTransactions(transactions.filter(transaction => transaction.budgetId === activeBudget.id));
    }
  }, [transactions, activeBudget]);

  useEffect(() => {
    if(activeBudget){
      setActiveBudgetCategories(categories.filter(category => category.budgetId === activeBudget.id));
    }
  }, [categories, activeBudget]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {budgets.length === 0 ? (
          <View style={styles.noBudgetsPanel}>
            <Text style={globalStyles.h2}>No budgets created</Text>
            <TouchableOpacity style={globalStyles.buttonA} onPress={() => router.push({pathname: "/budgetForm"})}>
              <View style={globalStyles.row}>
                <Ionicons style={globalStyles.buttonAText} name="add-circle-outline" size={12}/>
                <Text style={globalStyles.buttonAText}>Create a new budget</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={[ globalStyles.row, globalStyles.centered ]}>
              <View style={ globalStyles.column }>
                <TouchableOpacity onPress={()=>router.push({ pathname: '/budgetsList' })}>
                  <View style={[ globalStyles.row, styles.budgetSelectMenu ]}>
                    <View style={[{flex: 7, marginLeft: 'auto'}, globalStyles.centered ]}>
                      <Text style={[ globalStyles.h2 ]}>{activeBudget.name ? activeBudget.name : displayDateInFormat(activeBudget.date)}</Text>
                    </View>
                    <View style={[{flex: 1}, globalStyles.centered ]}>
                      <Ionicons name="caret-down" size={18} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView scrollEnabled={!isSwiping} style={{ flex: 1 }}>
              <View style={styles.homeContent}>
                <View style={globalStyles.row}>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.h3}>Balance</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.balance}> ${balance}</Text>
                    </View>
               </View>
                </View>
                <View style={[globalStyles.row, styles.homeContent]}>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.h3}>Expenses</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={styles.totalExpenses}>${expenses}</Text>
                    </View>
                    <Feather style={styles.totalExpenses} name="arrow-up-right"/>
                  </View>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>Income</Text>
                    </View>

                    <View style={globalStyles.row}>
                      <Text style={styles.totalIncome}>${income}</Text>
                    </View>
                    <Feather style={styles.totalIncome} name="arrow-down-left"/>
                  </View>
                </View>
                <View style={styles.homeContent}>
                  <CategoriesList
                    openModal={() => setModalVisible(true)}
                  />
                  <TransactionList/>
                  <CategoryModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    setCategory={(category) => toAddCategory(category)}
                    categories={activeBudget.allocatedCategories}
                    filterSelected={false}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    padding: 10,
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    width: '95%'
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  noBudgetsPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 48,
    fontFamily: 'PlusJakarta',
  },
  totalExpenses: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
    color: 'red',
  },
  totalIncome: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
    color: 'green',
  },
  budgetSelectMenu: {
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 50,
    marginRight: 50,
    padding: 5,
  },
  homeContent: {
    marginTop: 20,
  }
});
