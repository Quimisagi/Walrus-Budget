import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Text, Button, View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobal } from '../_layout';
import { deleteAllData, getData, storeData } from '../../src/storage';
import globalStyles from '../../src/globalStyles';
import CategoryModal from '../../src/categoryModal';
import { router } from 'expo-router';
import AllocatedCategoriesList from '../../src/allocatedCategoriesList';
import TransactionList from '../../src/transactionsList';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';

export default function Home() {
  const navigation = useNavigation();

  const { activeBudgetId, budgets, transactions, activeBudget, setActiveBudget} = useGlobal();

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);

  const [index, setIndex] = useState(0);
  const routes = [
    { key: 'allocatedCategories', title: 'Allocated Categories' },
    { key: 'transactions', title: 'Transactions' },
  ];

  const AllocatedCategories = () => (
    <AllocatedCategoriesList
      allocatedCategories={activeBudget.allocatedCategories}
      openModal={() => setModalVisible(true)}
    />
  )

  const Transactions = () => (
    <TransactionList filteredTransactions={filteredTransactions}/>
  )

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
  const updateActiveBudget = async (budget) => {
    await storeData('activeBudget', JSON.stringify(budget));
    setActiveBudget(budget);
  }
  const toAddCategory = (category ) => {
    router.push({ pathname: '/categoryForm', params: { categoryId: category.id, activeBudgetId: activeBudgetId } });
    setModalVisible(false);
  }
  useEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  useEffect(() => {
    if(activeBudget){
      let filtered = transactions.filter(transaction => transaction.budgetId === activeBudget.id);
      setFilteredTransactions(filtered);
      setExpenses(calculateExpenses(filtered));
      setIncome(calculateIncome(filtered));
      setBalance(calculateBalance(activeBudget.begginingBalance, filtered));
    } 
  }, [activeBudget, budgets, transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {budgets.length === 0 ? (
          <View style={styles.noBudgetsPanel}>
            <Image source={require('../../src/icons/money-bag.png')} />
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
              <TouchableOpacity onPress={()=>router.push({ pathname: '/budgetsList' })}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.h2}>{activeBudget.name}</Text>
                  <Ionicons name="caret-down" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View>
                <View style={globalStyles.row}>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.h3}>beggining_balance_label</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.text}> ${activeBudget.begginingBalance}</Text>
                    </View>
                  </View>
                </View>
                <View style={globalStyles.row}>
                  <View style={globalStyles.column}>
                    <View style={[ globalStyles.row, globalStyles.centered ]}>
                      <Text style={globalStyles.text}>${expenses} </Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.centered}>expenses_label:</Text>
                    </View>
                  </View>
                  <View style={globalStyles.column}>
                    <View style={[ globalStyles.row, globalStyles.centered ]}>
                      <Text style={globalStyles.text}>${balance}</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.centered}>balance_label:</Text>
                    </View>
                  </View>
                  <View style={globalStyles.column}>
                    <View style={[ globalStyles.row, globalStyles.centered ]}>
                      <Text style={globalStyles.text}>${income}</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.centered}>income_label:</Text>
                    </View>
                  </View>
                </View>
                <View style={globalStyles.hr} />
                <CategoryModal
                  isVisible={isModalVisible}
                  onClose={() => setModalVisible(false)}
                  setCategory={(category) => toAddCategory(category)}
                  categories={activeBudget.allocatedCategories}
                  filterSelected={false}
                />
                <TabView
                  style={{ height: 300 }}
                  navigationState={{ index: index, routes: routes }}
                  renderScene={SceneMap({
                    allocatedCategories: AllocatedCategories,
                    transactions: Transactions
                  })}
                  onIndexChange={(index) => setIndex(index)}
                />
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
    marginTop: 20,
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
});