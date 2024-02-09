import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "./_layout";
import {View, Text} from "react-native";
import globalStyles from "../src/globalStyles";
import defaultCategories from "../defaultCategories";

const AllocatedCategoryDetails = () => {
  
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { transactions, activeBudget } = useGlobal();

  const {budgetId, categoryId} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [category, setCategory] = useState({})

  useEffect(() => {
    let categoryTemp = activeBudget.allocatedCategories.find(category => category.categoryId === parseInt(categoryId));
    const defaultCategory = defaultCategories.find(category => category.id === parseInt(categoryId));
    categoryTemp = Object.assign({}, categoryTemp, defaultCategory);
    setCategory(categoryTemp);
    console.log("Transactions?", transactions)
    if(transactions){
      const temp = transactions.filter(transaction => transaction.categoryId === parseInt(categoryId) && transaction.budgetId === budgetId);
      console.log(temp);
      setFilteredTransactions(temp);
    }
  }, []
  ) 

  return (
    <View>
      <View style={globalStyles.row}>
        <View style={[ globalStyles.categoryIcon, {backgroundColor: category.color} ]}>
          {category.icon}
        </View>
        <Text style={globalStyles.h1}>{category.name}</Text>
      </View>
      <View style={globalStyles.row}>
        <Text style={globalStyles.balance}>${category.amount}</Text>
      </View>
      {filteredTransactions.map((transaction) => (
        <View key={transaction.id}>
          <View style={globalStyles.row}>
            <View style={globalStyles.column}>
              <Text>{transaction.notes}</Text>
              <Text>{transaction.amount}</Text>
            </View>
            <View style={globalStyles.column}>
              <Text>{transaction.date}</Text>
            </View>
            <View style={globalStyles.hr} />
          </View>
        </View>
      ))}
    </View>

  )
}
export default AllocatedCategoryDetails;
