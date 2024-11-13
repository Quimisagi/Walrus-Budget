import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "../../utils/globalProvider";
import {View, Text, TouchableOpacity, TextInput } from "react-native";
import globalStyles from "../../utils/globalStyles";
import { StyleSheet } from "react-native";
import { Feather, AntDesign } from '@expo/vector-icons';
import { calculatePercentage } from "../../utils/numberUtils";
import { processMoneyValue, calculateIncome, calculateExpenses } from "../../utils/numberUtils";
import { storeData } from "../../utils/storage"; 
import Toast from 'react-native-toast-message';
import SwipeableItem from "../../utils/swipeableItem";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getContrastColor } from "../../utils/iconsList";

const CategoriesDetails= () => {

  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { transactions, setTransactions, activeBudget, categories, setCategories } = useGlobal();

  const {id} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [category, setCategory] = useState({})

  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [amount, setAmount] = useState(0);

  const deleteTransaction = async (transactionId) => {
    let index = transactions.findIndex(transaction => transaction.id === transactionId);
    let transactionsTemp = [...transactions];
    transactionsTemp.splice(index, 1);
    await storeData('transactions', JSON.stringify(transactionsTemp));
    setTransactions(transactionsTemp);
    Toast.show({
      type: 'success',
      text1: 'Transaction deleted',
      position: 'bottom',
    });
  }

  const deleteCategory = async () => {
    let index = categories.findIndex(cat => cat.id === id);
    let categoriesTemp = [...categories];
    categoriesTemp.splice(index, 1);
    await storeData('categories', JSON.stringify(categoriesTemp));
    setCategories(categoriesTemp);
    Toast.show({
      type: 'success',
      text1: 'Category deleted',
      position: 'bottom',
    });
    router.back();
  }

  const toEditTransaction = (transaction) => {
    router.push({ pathname: '/transactionsForm', params: { editMode: true, transactionId: transaction.id }});
  }
  const toEditCategory = () => {
    router.push({ pathname: '/categoryForm', params: { editMode: true, id: id }});
  }
  useEffect(() => {
    if (categories){
      const cat = categories.find(cat => cat.id === id);
      setCategory(cat);
      const filteredTransactions = transactions.filter(transaction => transaction.categoryId === id);
      setFilteredTransactions(filteredTransactions);
      const expensesTemp = calculateExpenses(filteredTransactions);
      setExpenses(expensesTemp);
      const income = calculateIncome(filteredTransactions);
      setIncome(income);
    }
  }, [activeBudget, transactions, categories]);
 
  useEffect(() => {
    if(category){
    if(-expenses + income >= 0)
      setPercentage(calculatePercentage(0, category.amount));
    else setPercentage(calculatePercentage(expenses, category.amount));
    }
  }, [expenses, amount, category, transactions]);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={globalStyles.row}>
          <TouchableOpacity
            style={{ marginTop: 15, marginRight: 20 }}
            onPress={toEditCategory}
          >
            <Feather name="edit" size={20}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 15, marginRight: 10}}
            onPress={deleteCategory}
          >
            <Feather name="trash" size={20}/>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, category]);


  return (
    <View style={globalStyles.container}>
      { category ? (
        <View>
          <View style={globalStyles.row}>
            <View style={[ globalStyles.column, {flex: 1} ]}>
              <View style={[ globalStyles.categoryIcon, globalStyles.centered, {backgroundColor: category.color} ]}>
                <FontAwesome6 name={category.icon} size={25} color={() => getContrastColor(category.color)} />
              </View>
            </View>
            <View style={[ globalStyles.column, { flex: 4} ]}>
              <Text style={globalStyles.h2}>{category.name}</Text>
            </View>
          </View>
          { category.amount === 0 ? (
            <View style={globalStyles.row}>
              <View style={[ globalStyles.column, {alignItems: 'flex-start'} ]}>
                <Text style={globalStyles.text}>Spent</Text>
                <Text style={globalStyles.h3}>${expenses}</Text>
              </View>
              <View style={[ globalStyles.column, globalStyles.centered, {alignItems: 'flex-end'} ]}>
                <Text style={globalStyles.h3}>-</Text>
                <Text style={globalStyles.text}>Remaining</Text>
              </View>
            </View>
          )
          : (
            <View>
              <View style={globalStyles.centered}>
                <Text style={globalStyles.text}>{percentage}% spent</Text>
              </View>
              <View style={styles.progressBar}> 
                {percentage >= 100 ? 
                  <View style={[styles.totalBar, {width: '100%', backgroundColor: category.color}]}/> : 
                  <View style={[styles.totalBar, {width: `${percentage}%`, backgroundColor: category.color}]}/>
                }
              </View>
              <View style={globalStyles.row}>
                <View style={[ globalStyles.column, {alignItems: 'flex-start'} ]}>
                  <Text style={globalStyles.text}>Spent</Text>
                  <Text style={globalStyles.h3}>-${expenses}</Text>
                  <Text style={globalStyles.h3}>+${income}</Text>
                </View>
                <View style={[ globalStyles.column, {alignItems: 'flex-end'} ]}>
                  {-expenses + income >= 0 ? 
                    (<Text style={globalStyles.h3}>{category.amount}</Text>) :
                    <Text style={globalStyles.h3}>${category.amount - expenses + income}</Text>
                  }
                  <Text style={globalStyles.text}>Remaining</Text>
                </View>
              </View>
            </View>
          )}

        </View>
      ) : null}
      <View style={globalStyles.hr}/>
      {filteredTransactions.map((transaction) => (
        <SwipeableItem key={transaction.id} onDelete={() => deleteTransaction(transaction.id)}>
          <TouchableOpacity onPress={() => toEditTransaction(transaction)}>
            <View style={globalStyles.transactionContainer}>
              <View style={globalStyles.row}>
                <View style={[ globalStyles.column, { flex: 1 } ]}>
                  <Feather style={styles.totalExpenses} name="arrow-up-right" size={30} color={'red'}/>
                </View>
                <View style={[ globalStyles.column, { flex: 4 }]}>
                  {transaction.notes ? 
                    <Text style={globalStyles.h3}>{transaction.notes}</Text> : 
                    <Text style={[globalStyles.h3, { color: '#9095a0' }]}>(No description)</Text>}
                  <View style={globalStyles.row}>
                    <Text>{transaction.date}</Text>
                    <Text> {transaction.time}</Text>
                  </View>
                </View>
                <View style={[ globalStyles.column, { flex: 2 } ]}>
                  <Text style={globalStyles.expense}>${transaction.amount}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      ))}
      <TouchableOpacity style={globalStyles.addButton} onPress={() => router.push({ pathname: '/transactionsForm', params: {categoryId: id}})}>
        <Feather name="plus" size={24} color="white" />
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


export default CategoriesDetails;
