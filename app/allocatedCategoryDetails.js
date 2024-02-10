import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "./_layout";
import {View, Text} from "react-native";
import globalStyles from "../src/globalStyles";
import defaultCategories from "../defaultCategories";
import { StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';

const AllocatedCategoryDetails = () => {
  
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { transactions, activeBudget } = useGlobal();

  const {budgetId, categoryId} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [category, setCategory] = useState({})

  const [spent, setSpent] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const calculatePercentage = (spent, budgeted) => {
    return Math.round((spent / budgeted) * 100);
  }

  useEffect(() => {
    let categoryTemp = activeBudget.allocatedCategories.find(category => category.categoryId === parseInt(categoryId));
    const defaultCategory = defaultCategories.find(category => category.id === parseInt(categoryId));
    categoryTemp = Object.assign({}, categoryTemp, defaultCategory);
    setCategory(categoryTemp);
    if(transactions){
      const temp = transactions.filter(transaction => transaction.categoryId === parseInt(categoryId) && transaction.budgetId === budgetId);
      setFilteredTransactions(temp);
      let spentTemp = 0;
      temp.map(transaction => spentTemp += transaction.amount);
      setSpent(spentTemp);
    }
  }, []
  ) 

  useEffect(() => {
    setPercentage(calculatePercentage(spent, category.amount));
  }, [spent, category.amount]);

  return (
    <View style={styles.container}>
      <View style={globalStyles.row}>
        <View style={[ globalStyles.column, {flex: 1} ]}>
          <View style={[ globalStyles.categoryIcon, globalStyles.centered, {backgroundColor: category.color, transform: [{scale: 1.3}]} ]}>
          {category.icon}
          </View>
        </View>
        <View style={[ globalStyles.column, { flex: 4} ]}>
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
      </View>
      <View style={globalStyles.centered}>
        <Text style={globalStyles.label}>Budgeted</Text>
        <Text style={globalStyles.balance}>${category.amount}</Text>
      </View>
      <View style={globalStyles.hr}/>
      {filteredTransactions.map((transaction) => (
        <View style={globalStyles.transactionContainer} key={transaction.id}>
          <View style={globalStyles.row}>
            <View style={[ globalStyles.column, { flex: 1 } ]}>
              <Feather style={styles.totalExpenses} name="arrow-up-right" size={30} color={'red'}/>
            </View>
            <View style={[ globalStyles.column, { flex: 4 }]}>
              <Text style={globalStyles.h3}>{transaction.notes}</Text>
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
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    padding: 10,
  },
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
  }
});


export default AllocatedCategoryDetails;
