import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "../utils/globalProvider";
import {View, Text, TouchableOpacity, TextInput } from "react-native";
import globalStyles from "../utils/globalStyles";
import defaultCategories from "../utils/defaultCategories";
import { StyleSheet } from "react-native";
import { Feather, AntDesign } from '@expo/vector-icons';
import { calculatePercentage } from "../utils/numberUtils";
import { processMoneyValue } from "../utils/numberUtils";
import { storeData } from "../utils/storage"; 
import Toast from 'react-native-toast-message';


const AllocatedCategoryDetails = () => {
  
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { budgets, setBudgets, transactions, activeBudget } = useGlobal();

  const {id, budgetId, categoryId} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [category, setCategory] = useState({})

  const [spent, setSpent] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(0);

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
    router.back();
  }

  const toEditTransaction = (transaction) => {
    router.push({ pathname: '/transactionsForm', params: { editMode: true, transactionId: transaction.id }});
  }


  const editCategoryAmount = async () => {
    let categoryIndex = activeBudget.allocatedCategories.findIndex(cat => cat.id === id) 
    let allocatedCategoriesTemp = [...activeBudget.allocatedCategories];
    allocatedCategoriesTemp[categoryIndex].amount = amount;
    let budgetsCopy = [...budgets];
    let budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
    budgetsCopy[budgetIndex].allocatedCategories = allocatedCategoriesTemp;
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
    await storeData('activeBudget', JSON.stringify(activeBudget));
    activeBudget.allocatedCategories = allocatedCategoriesTemp;
    setEditMode(false);
  }

  const showToast = () => {
    console.log("Should show toast")
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is a success message',
    });
  }

  useEffect(() => {
    let categoryTemp = activeBudget.allocatedCategories.find(category => category.id === id);
    if(!categoryTemp) return;
    const defaultCategory = defaultCategories.find(category => category.id === parseInt(categoryTemp.categoryId));
    categoryTemp = Object.assign({}, categoryTemp, defaultCategory);
    setCategory(categoryTemp);
    if(transactions){
      const temp = transactions.filter(transaction => transaction.allocatedCategoryId === id && transaction.budgetId === budgetId);
      setFilteredTransactions(temp);
      let spentTemp = 0;
      temp.map(transaction => spentTemp += transaction.amount);
      setSpent(spentTemp);
    }

  }, [budgets, transactions]
  ) 

  useEffect(() => {
    setPercentage(calculatePercentage(spent, category.amount));
  }, [spent, amount, category.amount, transactions]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: category.name,
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={deleteCategory}
        >
          <Feather name="trash" size={20}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation, category]);


  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.row}>
        <View style={[ globalStyles.column, {flex: 1} ]}>
          <View style={[ globalStyles.categoryIcon, globalStyles.centered, {backgroundColor: category.color, transform: [{scale: 1.3}]} ]}>
            {category.icon}
          </View>
        </View>
        <View style={[ globalStyles.column, { flex: 4} ]}>
          { category.amount === 0 ? (
            <View style={globalStyles.row}>
              <View style={[ globalStyles.column, {alignItems: 'flex-start'} ]}>
                <Text style={globalStyles.h3}>${spent}</Text>
                <Text style={globalStyles.text}>Spent</Text>
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
                  <Text style={globalStyles.h3}>${spent}</Text>
                  <Text style={globalStyles.text}>Spent</Text>
                </View>
                <View style={[ globalStyles.column, {alignItems: 'flex-end'} ]}>
                  <Text style={globalStyles.h3}>${category.amount - spent}</Text>
                  <Text style={globalStyles.text}>Remaining</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={globalStyles.centered}>
        <Text style={globalStyles.text}>Budgeted</Text>
        {editMode ? (
          <View style={globalStyles.row}>
            <TextInput
              style={[ globalStyles.inputField, {width: '80%', alignContent: 'center'} ]}
              keyboardType="numeric"
              placeholder="$0.00"
              value={"$" + amount.toString()}
              onChangeText={(text) => setAmount(processMoneyValue(text))}
            />
            <TouchableOpacity onPress={() => editCategoryAmount()}>
              <AntDesign style={{marginLeft: 5}} name="check" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditMode(false)}>
              <AntDesign style={{marginLeft: 5}} name="cancel" size={24} color="black" />
            </TouchableOpacity>

          </View>
        ) : (
          <View style={globalStyles.row}>
            <Text style={globalStyles.h3}>${category.amount}</Text>
            <TouchableOpacity onPress={() => { setEditMode(true); setAmount(category.amount)}}>
              <Feather style={{marginLeft: 5}} name="edit"/>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={globalStyles.hr}/>
      {filteredTransactions.map((transaction) => (
        <TouchableOpacity key={transaction.id} onPress={() => toEditTransaction(transaction)}>
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
      ))}
      <TouchableOpacity onPress={showToast}>
        <Text> Show toast </Text>
      </TouchableOpacity>
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


export default AllocatedCategoryDetails;
