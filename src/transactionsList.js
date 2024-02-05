import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import defaultCategories from '../defaultCategories';
import globalStyles from '../src/globalStyles';
import { router } from "expo-router";
import { useGlobal } from '../app/_layout';
import { getData, storeData } from "./storage"; 


const TransactionList = ({filteredTransactions}) => {
  const [transactionsWithCategories, setTransactionsWithCategories] = useState([]);

  const {transactions, setTransactions} = useGlobal();

  const toEditTransaction = (transaction) => {
    router.push({ pathname: '/transactionsForm', params: { transactionId: transaction.id }});
  }
  const deleteTransaction = async (transactionId) => {
    let index = transactions.findIndex(transaction => transaction.id === transactionId);
    let transactionsTemp = [...transactions];
    transactionsTemp.splice(index, 1);
    await storeData('transactions', JSON.stringify(transactionsTemp));
    setTransactions(transactionsTemp);

  }
  useEffect(() => {
    if (filteredTransactions){
      const transactionsTemp = filteredTransactions.map(transaction => {
        const category = defaultCategories.find(category => category.id === transaction.categoryId);
        return { ...transaction, category };
      });
      setTransactionsWithCategories(transactionsTemp);
    }
  }
    , [filteredTransactions]);
  return (
    <View>
      <Text>Transactions:</Text>
      {transactionsWithCategories.map((transaction, index) => (
        <View style={globalStyles.row} key={index}>
          <View style={globalStyles.column}>
            {transaction.category ? (transaction.category.icon) : (<Text>no icon</Text>)}
            <Text>{transaction.notes}</Text>
          </View>
          <View style={globalStyles.column}>
            <Text>{transaction.amount}</Text>
            <Text>{transaction.date}</Text>
          </View>
          <Text>{transaction.transactionType}</Text>
          <TouchableOpacity onPress={() => toEditTransaction(transaction)}>
            <View style={[styles.button, { backgroundColor: '#000' }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTransaction(transaction.id)}>
            <View style={[styles.button, { backgroundColor: '#E31' }]} />
          </TouchableOpacity>

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },
});

export default TransactionList;

