import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "../../utils/globalProvider";
import { useTranslation } from 'react-i18next';
import {View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import globalStyles from "../../utils/globalStyles";
import defaultCategories from "../../utils/defaultCategories";
import { StyleSheet } from "react-native";
import { Feather, AntDesign } from '@expo/vector-icons';
import { calculatePercentage, calculateIncome, calculateExpenses } from "../../utils/numberUtils";
import { storeData } from "../../utils/storage"; 
import Toast from 'react-native-toast-message';
import SwipeableItem from "../../utils/swipeableItem";
import { formatMoney } from "../../utils/numberUtils";
import { showCurrency } from '../../utils/currency';


const AccountDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { budgets, transactions, setTransactions, activeBudget, setAccounts, accounts, currency } = useGlobal();

  const {id} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [account, setAccount] = useState({});

  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(0);

  const deleteTransaction = async (transactionId) => {
    let index = transactions.findIndex(transaction => transaction.id === transactionId);
    let transactionsTemp = [...transactions];
    transactionsTemp.splice(index, 1);
    await storeData('transactions', JSON.stringify(transactionsTemp));
    setTransactions(transactionsTemp);
    Toast.show({
      type: 'success',
      text1: t('general.transaction_delete_success'),
      position: 'top',
    });
  }

  const deleteAccount = async (id) => {
    let accountsTemp = accounts.filter(account => account.id !== id);
    await storeData('accounts', JSON.stringify(accountsTemp));
    setAccounts(accountsTemp);
    router.back();
    Toast.show({
      type: 'success',
      position: 'top',
      text1: t('general.account_delete_success'),
    });
  }


  const deleteCategory = async () => {
    let categoryIndex = activeBudget.allocatedCategories.findIndex(cat => cat.id === id) 
    let allocatedCategoriesTemp = [...activeBudget.allocatedCategories];
    allocatedCategoriesTemp.splice(categoryIndex, 1);
    let budgetsCopy = [...budgets];
    let budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
    activeBudget.allocatedCategories = allocatedCategoriesTemp;
    budgetsCopy[budgetIndex] = activeBudget;
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
    await storeData('activeBudget', JSON.stringify(activeBudget));
    activeBudget.allocatedCategories = allocatedCategoriesTemp;
    Toast.show({
      type: 'success',
      text1: t('general.category_delete_success'),
      position: 'bottom',
    });
    router.back();
  }

  const toEditTransaction = (transaction) => {
    router.push({ pathname: '/transactionsForm', params: { editMode: true, transactionId: transaction.id }});
  }

  useEffect(() => {
    const account = accounts.find(account => account.id === id);
    setAccount(account);
    if(transactions){
      let transactionsTemp = transactions.filter(transaction => transaction.accountId === id);
      transactionsTemp = transactionsTemp.map(transaction => {
        let category = activeBudget.allocatedCategories.find(category => category.id === transaction.allocatedCategoryId);
        category = defaultCategories.find(category => category.id === parseInt(category.categoryId));
        return {...transaction, category};
      });
      setFilteredTransactions(transactionsTemp);
      const expensesTemp = calculateExpenses(transactionsTemp);
      const incomeTemp = calculateIncome(transactionsTemp);
      setExpenses(expensesTemp);
      setIncome(incomeTemp);
    }
  }, [budgets, transactions]
  ) 

  useEffect(() => {
    const totalSpent = expenses + income; 
    setPercentage(calculatePercentage(totalSpent, account.initialValue));
  }, [expenses, account]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => deleteAccount(id)}
          style={{ margin: 15 }}
        >
          <Feather name="trash" size={20}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={globalStyles.h2}>{account.name}</Text>
      </View>
      <View style={[globalStyles.row, globalStyles.block]}>
        <View style={[globalStyles.centered, {flex: 1}]}>
          <Text style={globalStyles.h3}>{t('general.balance')}</Text>
          <Text style={globalStyles.balance}>{showCurrency(currency)}{formatMoney((account.initialValue + (expenses * -1) + income).toLocaleString())}</Text>
        </View>
      </View>
      <View style={[globalStyles.row, globalStyles.block]}>
        <View style={[{flex: 1}, globalStyles.centered]}>
          <Text style={globalStyles.h3}>{t('general.expense')}</Text>
          <Text style={globalStyles.expense}>-{showCurrency(currency)}{formatMoney(expenses.toLocaleString())}</Text>
        </View>
        <View style={[{flex: 1}, globalStyles.centered]}>
          <Text style={globalStyles.h3}>{t('general.income')}</Text>
          <Text style={globalStyles.income}>+{showCurrency(currency)}{formatMoney(income.toLocaleString())}</Text>
        </View>
      </View>
      <ScrollView style={globalStyles.block}>
    {[...filteredTransactions].reverse().map((transaction) => (
        <SwipeableItem key={transaction.id} onDelete={() => deleteTransaction(transaction.id)}>
          <TouchableOpacity onPress={() => toEditTransaction(transaction)}>
            <View style={globalStyles.transactionContainer}>
              <View style={globalStyles.row}>
                <View style={[globalStyles.centered, { flex: 2 } ]}>
                  {transaction.transactionType === -1 ? (
                  <Feather style={styles.totalExpenses} name="arrow-up-right" size={30} color={'red'}/>
                  ) : (
                  <Feather style={styles.totalIncome} name="arrow-down-right" size={30} color={'green'}/>
                  )}
                </View>
                <View style={[ globalStyles.column, { flex: 6 }]}>
                  {transaction.notes ? 
                    <Text style={globalStyles.h3}>{transaction.notes}</Text> : 
                    <Text style={[globalStyles.h3, { color: '#9095a0' }]}>(No description)</Text>}
                  <View style={globalStyles.row}>
                    <Text>{transaction.date}</Text>
                    <Text> {transaction.time}</Text>
                  </View>
                </View>
                <View style={[{ flex: 3 }, globalStyles.centered ]}>
                  {transaction.transactionType === -1 ? (   
                  <Text style={globalStyles.expense}>-{showCurrency(currency)}{formatMoney(transaction.amount.toLocaleString())}</Text>
                  ) : (
                  <Text style={globalStyles.income}>+{showCurrency(currency)}{formatMoney(transaction.amount.toLocaleString())}</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
    ))}
      </ScrollView>
      <TouchableOpacity style={globalStyles.addButton} onPress={() => router.push({ pathname: '/transactionsForm', params: {accountId: id}})}>
        <Feather name="plus" size={35} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  progressBar: {
    height: 7,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#cfd2da',
    marginTop: 10,
    marginBottom: -10,
  },
  totalBar: {
    height: 7,
    borderRadius: 10,
    zIndex: 10,
  },
});


export default AccountDetails;
