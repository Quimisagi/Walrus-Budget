import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobal } from '../../utils/globalProvider';
import globalStyles from '../../utils/globalStyles';
import CategoryModal from '../components/categoryModal';
import { router } from 'expo-router';
import CategoriesList from '../components/categoriesList';
import TransactionList from '../components/transactionsList';
import { Ionicons, Feather, FontAwesome6 } from '@expo/vector-icons';
import { displayDateInFormat } from '../../utils/dateUtils';
import { calculateExpenses, calculateIncome, formatMoney, calculateBudgetedInCategories } from '../../utils/numberUtils';
import { showCurrency } from '../../utils/currency';


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
    currency,
  } = useGlobal();

  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [budgetedInCategories, setBudgetedInCategories] = useState(0);

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
      setInitialValue(activeBudget.begginingBalance);
      setBudgetedInCategories(calculateBudgetedInCategories(activeBudgetCategories));
      setExpenses(calculateExpenses(activeBudgetTransactions));
      setIncome(calculateIncome(activeBudgetTransactions));
      setBalance(calculateBalance(activeBudget.begginingBalance, activeBudgetTransactions));
    } 
  }, [activeBudget, budgets, transactions, activeBudgetTransactions, activeBudgetCategories]);

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
          <View>

          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={[ globalStyles.row, globalStyles.centered ]}>
              <TouchableOpacity 
                style={{flex : 1, marginLeft: 5}}
                onPress={() => router.push({ pathname: '/settings' })}
              >
                <FontAwesome6 name="wrench" size={25} color="black" />
              </TouchableOpacity>
              <View style={{flex: 5}}>
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
              <View style={{flex: 1}}></View>
            </View>
            <ScrollView scrollEnabled={!isSwiping} style={{ flex: 1 }}>
              <View style={styles.homeContent}>
                <View style={styles.currentBudget}>
                  <View style={globalStyles.row}>
                    <View style={[globalStyles.column, globalStyles.centered]}>

                      {/* Balance title */}
                      <View style={globalStyles.row}>
                        <Text style={globalStyles.h3}>Balance</Text>
                      </View>

                      {/* Income */}
                      <View style={[globalStyles.row, globalStyles.centered, { marginBottom: -10, marginTop: 10 }]}>
                        <View style={{ flex: 4 }} />
                        <View style={[globalStyles.row, globalStyles.centered] }>
                          <Feather style={[ styles.totalIncome, {paddingTop: 5, marginHorizontal: 5} ]} name="arrow-down-left" />
                          <Text style={styles.totalIncome}>+{showCurrency(currency)}{formatMoney(income.toLocaleString())}</Text>
                        </View>
                        <View style={{ flex: 4 }} />
                      </View>


                      {/* Balance amount */}
                      <View style={globalStyles.row}> 
                        <Text style={globalStyles.balance}>{showCurrency(currency)}{formatMoney(balance.toLocaleString())}</Text>
                      </View>


                      {/* Expenses */}
                      <View style={[globalStyles.row, globalStyles.centered]}>
                        <View style={{ flex: 4 }} />
                        <View style={[ globalStyles.row, globalStyles.centered ] }>
                          <Feather style={[ styles.totalExpenses, {paddingTop: 5, marginHorizontal: 5} ]} name="arrow-up-right" />
                          <Text style={styles.totalExpenses}>-{showCurrency(currency)}{formatMoney(expenses.toLocaleString())}</Text>
                        </View>
                        <View style={{ flex: 4 }} />
                      </View>
                    </View>
                  </View>
                  <View style={[globalStyles.row, styles.homeContent]}>
                    <View style={[ globalStyles.column, globalStyles.centered, styles.circleSection ]}>
                      <View style={[ globalStyles.row ]}>
                        <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>Initial Value</Text>
                      </View>
                      <View style={globalStyles.row}>
                        <Text style={styles.value}>{showCurrency(currency)}{formatMoney(initialValue.toLocaleString())}</Text>
                      </View>
                    </View>
                    <View style={[ globalStyles.column, globalStyles.centered, styles.circleSection ]}>
                      <View style={[ globalStyles.row]}>
                        <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>Budgeted</Text>
                      </View>

                      <View style={globalStyles.row}>
                        <Text style={styles.value}>{showCurrency(currency)}{formatMoney(budgetedInCategories.toLocaleString())}</Text>
                      </View>
                    </View>
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
    color: '#FB5A4B',
    textAlign: 'center',
  },
  totalIncome: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
    color: '#1C9B4F',
  },
  value: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
  },
  budgetSelectMenu: {
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  homeContent: {
    marginTop: 20,
  },
  walrus: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes content to the bottom
  },
  circleSection: {
    borderRadius: 100,
    width: 80,
    height: 80,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
