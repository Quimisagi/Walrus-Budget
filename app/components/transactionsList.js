import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import defaultCategories from '../../utils/defaultCategories';
import globalStyles from '../../utils/globalStyles';
import { router } from "expo-router";
import { useGlobal } from '../../utils/globalProvider';
import { getData, storeData } from "../../utils/storage"; 
import { Feather } from '@expo/vector-icons';


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
      <Text style={globalStyles.h2}>Transactions</Text>
        {transactionsWithCategories.map((transaction, index) => (
        <View style={globalStyles.transactionContainer} key={index}>
          <View style={globalStyles.row}>
            <View style={[ globalStyles.column, { flex: 1} ]}>
              {transaction.category ? 
                <View style={[globalStyles.categoryIcon, {backgroundColor: transaction.category.color, transform: [{scale: 0.85}]}]}>
                  {transaction.category.icon}
                </View>
                : (<Text>no icon</Text>)}
            </View>
            <View style={[ globalStyles.column, { flex: 4 } ]}>
              {transaction.category ? 
                <Text style={globalStyles.secondaryText}>{transaction.category.name}</Text> : 
                <Text style={globalStyles.secondaryText}>(No category)</Text>}
              {transaction.notes ? 
                <Text style={globalStyles.h3}>{transaction.notes}</Text> : 
                <Text style={[globalStyles.h3, { color: '#9095a0' }]}>(No description)</Text>}
              <View style={globalStyles.row}>
                <Text>{transaction.date} </Text>
                <Text> {transaction.time}</Text>
              </View>
            </View>
            <View style={[ globalStyles.column, { flex: 2 } ]}>
              <View style={[ globalStyles.row, styles.prueba ]}>
                <Text style={globalStyles.expense}>-${transaction.amount}</Text>
              </View>
            </View>
          </View>
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
  prueba: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default TransactionList;

