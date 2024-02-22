import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Text, Button, View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobal } from '../../utils/globalProvider';
import { deleteAllData, getData, storeData } from '../../utils/storage';
import globalStyles from '../../utils/globalStyles';
import CategoryModal from '../components/categoryModal';
import { router } from 'expo-router';
import AllocatedCategoriesList from '../components/allocatedCategoriesList';
import TransactionList from '../components/transactionsList';
import { Ionicons, Feather } from '@expo/vector-icons';
import { setupCategories } from '../../utils/numberUtils';


import * as Font from 'expo-font';

Font.loadAsync({
  'PlusJakarta': require('../../assets/fonts/PlusJakartaSans.ttf'),
});


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
            <Image source={require('../../assets/icons/money-bag.png')} />
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
                      <Text style={[ globalStyles.h2 ]}>{activeBudget.name}</Text>
                    </View>
                    <View style={[{flex: 1}, globalStyles.centered ]}>
                      <Ionicons name="caret-down" size={18} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View>
                <View style={globalStyles.row}>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.h3}>Balance:</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.balance}> ${balance}</Text>
                    </View>
                  </View>
                </View>
                <View style={globalStyles.row}>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={styles.totalExpenses}>${expenses}</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.h3}>Expenses</Text>
                    </View>
                    <Feather style={styles.totalExpenses} name="arrow-up-right"/>
                  </View>
                  <View style={[ globalStyles.column, globalStyles.centered ]}>
                    <View style={globalStyles.row}>
                      <Text style={styles.totalIncome}>${income}</Text>
                    </View>
                    <View style={globalStyles.row}>
                      <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>Income</Text>
                    </View>
                    <Feather style={styles.totalIncome} name="arrow-down-left"/>
                  </View>
                </View>
                <View style={globalStyles.hr} />
                <AllocatedCategoriesList
                  openModal={() => setModalVisible(true)}
                />
                <TransactionList
                  filteredTransactions={filteredTransactions}
                />
                <CategoryModal
                  isVisible={isModalVisible}
                  onClose={() => setModalVisible(false)}
                  setCategory={(category) => toAddCategory(category)}
                  categories={activeBudget.allocatedCategories}
                  filterSelected={false}
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
    marginTop: 40,
    padding: 5,
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
  }
});
