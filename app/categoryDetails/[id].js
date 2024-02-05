import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {useGlobal} from "../_layout";
import {View, Text} from "react-native";
import globalStyles from "../../src/globalStyles";

const AllocatedCategoryDetails = () => {
  
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { transactions, activeBudget } = useGlobal();

  const {budgetId, categoryId} = params;

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [category, setCategory] = useState({})

  useEffect(() => {
    const categoryTemp = activeBudget.allocatedCategories.find(category => category.id === categoryId);
    setCategory(categoryTemp);
    if(transactions){
      const temp = transactions.filter(transaction => transaction.categoryId === categoryId && transaction.budgetId === budgetId);
      setFilteredTransactions(temp);
    }
  }, []
  ) 

  return (
    <View>
      {category ? (
        <Text>category.name</Text>
      ) : null }
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
