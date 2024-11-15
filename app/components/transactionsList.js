import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import globalStyles from '../../utils/globalStyles';
import { router } from "expo-router";
import { useGlobal } from '../../utils/globalProvider';
import { getData, storeData } from "../../utils/storage"; 
import SwipeableItem from '../../utils/swipeableItem';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getContrastColor } from '../../utils/iconsList';

const TransactionList = () => {
  const [transactionsWithCategories, setTransactionsWithCategories] = useState([]);

  const { 
    activeBudget,
    transactions,
    setTransactions,
    activeBudgetTransactions,
    activeBudgetCategories,
    accounts
  } = useGlobal();

  const toEditTransaction = (transaction) => {
    router.push({ pathname: '/transactionsForm', params: { editMode: true, transactionId: transaction.id }});
  }
  const deleteTransaction = async (transactionId) => {
    let index = transactions.findIndex(transaction => transaction.id === transactionId);
    let transactionsTemp = [...transactions];
    transactionsTemp.splice(index, 1);
    await storeData('transactions', JSON.stringify(transactionsTemp));
    setTransactions(transactionsTemp);
  }
  useEffect(() => {
    if (activeBudgetTransactions){
      let transactionsWithCategoriesTemp = activeBudgetTransactions.map(transaction => {
        let category = activeBudgetCategories.find(category => category.id === transaction.categoryId);
        let account = accounts.find(account => account.id === transaction.accountId);
        return {
          ...transaction,
          category,
          account
        }
      });
      setTransactionsWithCategories(transactionsWithCategoriesTemp);
    }
  }
    , [activeBudgetTransactions, activeBudgetCategories, accounts]);
  return (
    <View style={styles.transactionsContainer}>
      <Text style={globalStyles.h2}>Transactions</Text>
      <View style={globalStyles.block}>
        {transactionsWithCategories.map((transaction, index) => (
          <SwipeableItem key={transaction.id} onDelete={() => deleteTransaction(transaction.id)}>
            <TouchableOpacity onPress={() => toEditTransaction(transaction)}>
              <View style={globalStyles.transactionContainer}>
                <View style={globalStyles.row}>
                  <View style={[ globalStyles.column, { flex: 2} ]}>
                    {transaction.category ? 
                        (
                          <View style={[globalStyles.categoryIcon, {backgroundColor: transaction.category.color }]}>
                            <FontAwesome6 name={transaction.category.icon} size={20} color={getContrastColor(transaction.category.color)} />

                          </View>
                        )
                        : (<View style={[globalStyles.categoryIcon, {backgroundColor: 'gray' }]}/> )}

                  </View>
                  <View style={[ globalStyles.column, { flex: 8 } ]}>
                    <View style={globalStyles.row}>
                      {transaction.category ? 
                        <Text style={globalStyles.secondaryText}>{transaction.category.name}</Text> : 
                        <Text style={globalStyles.secondaryText}>(No category)</Text>
                      }
                      {transaction.account ?
                          (<Text style={globalStyles.secondaryText}>・{transaction.account.name}</Text>) 
                          : null
                      }
                    </View>
                    {transaction.notes ? 
                      <Text style={globalStyles.h3}>{transaction.notes}</Text> : 
                      <Text style={[globalStyles.h3, { color: '#9095a0' }]}>(No description)</Text>}
                    <View style={globalStyles.row}>
                      <Text>{transaction.date} </Text>
                      <Text> {transaction.time}</Text>
                    </View>
                  </View>
                  <View style={[ globalStyles.column, { flex: 4 } ]}>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.secondaryText}></Text>
                    </View>
                    <View style={globalStyles.row}>
                      <View style={[ globalStyles.row, styles.prueba ]}>
                        {transaction.transactionType === -1 ? 
                          <Text style={globalStyles.expense}>-${transaction.amount}</Text> :
                          <Text style={globalStyles.income}>+${transaction.amount}</Text>
                        }
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </SwipeableItem>
        ))}
      </View>
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
  },
  transactionsContainer: {
    padding: 10,
  },

});

export default TransactionList;

