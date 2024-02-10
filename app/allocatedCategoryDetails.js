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

  return (
    <View style={styles.container}>
      <View style={globalStyles.row}>
        <View style={[ globalStyles.column, {flex: 1} ]}>
          <View style={[ globalStyles.categoryIcon, {backgroundColor: category.color} ]}>
          {category.icon}
          </View>
        </View>
        <View style={[ globalStyles.column, { flex: 5} ]}>
          <Text style={globalStyles.h1}>{category.name}</Text>
        </View>
      </View>
      <View style={globalStyles.row}>
        <View style={globalStyles.column}>
          <Text style={globalStyles.h3}>Spent</Text>
          <Text style={globalStyles.amount}>${spent}</Text>
        </View>
        <View style={globalStyles.column}>
          <Text style={globalStyles.h3}>Budgeted</Text>
          <Text style={globalStyles.amount}>${category.amount}</Text>
        </View>
        <View style={globalStyles.column}>
          <Text style={globalStyles.h3}>Remaining</Text>
          <Text style={globalStyles.amount}>${category.amount - spent}</Text>
        </View>
      </View>
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
    marginTop: 20,
    padding: 10,
  },
});


export default AllocatedCategoryDetails;
