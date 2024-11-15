import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { useEffect, useState } from 'react';
import globalStyles from '../../utils/globalStyles';
import { useRouter, useNavigation } from "expo-router";
import { getData, storeData } from "../../utils/storage"; 
import { useGlobal } from '../../utils/globalProvider';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import SwipeableItem from '../../utils/swipeableItem';
import { formatMoney } from '../../utils/numberUtils';

const AccountsList = () => {

  const router = useRouter();
  const navigation = useNavigation();

  const { accounts, setAccounts, transactions } = useGlobal();

  const [updatedAccounts, setUpdatedAccounts] = useState([]);

  const goToEditBudget = (id) => {
    router.push({pathname: 'budgetForm', params: { editMode: true, id: id } });
  }

  deleteAccount = async (id) => {
    let accountsTemp = accounts.filter(account => account.id !== id);
    await storeData('accounts', JSON.stringify(accountsTemp));
    setAccounts(accountsTemp);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Account deleted',
    });
  }

  useEffect(() => {
    navigation.setOptions({headerShown: false });
  }, []);


  useEffect(() => {
    accounts.map(account => {
      let balance = account.initialValue;
      transactions.map(transaction => {
        if(transaction.accountId === account.id){
          balance += transaction.amount * transaction.transactionType;
        }
      });
      account.balance = balance;
    }
    );
    setUpdatedAccounts(accounts);
  }
    , [transactions, accounts]);

  return (
    <View style={styles.container}> 
      <View style={globalStyles.row}>
        <Text style={globalStyles.h2}>Accounts</Text>
      </View>
      <ScrollView>
        <TouchableOpacity
          style={[globalStyles.row, styles.addNewAccount]}
          onPress={() => router.push({ pathname: '/accountForm'})}
        >
          <View style={{flex: 4}}>
          </View>
          <View style={{flex: 2}}>
            <Ionicons name="add-circle-outline" size={30} color={'#00A5E0'} />
          </View>
          <View style={{flex: 6}}>
            <Text style={[globalStyles.h3, styles.addNewAccountText]}>Add new account</Text>
          </View>
          <View style={{flex: 4}}>
          </View>
        </TouchableOpacity>
        { accounts ? 
            (
              updatedAccounts.map(account => (
                <TouchableOpacity 
                  key={account.id}
                  onPress={() => router.push({ pathname: ('/accountDetails/' + account.id) })} 
                >
                  <View style={[ globalStyles.transactionContainer, {padding: 10, paddingLeft: 20} ]}>
                    <View style={globalStyles.row}>
                      <View style={{flex: 4}}>
                        <Text style={globalStyles.h2}>{account.name}</Text>
                      </View>
                      <View style={{flex: 2}}>
                        <Text style={globalStyles.amount}>${formatMoney(account.balance.toLocaleString())}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : 
            (
              <Text>No accounts</Text>
            ) 
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    marginTop: 45,
    padding: 30,
    flex: 1
  },
  addNewAccount: {
    backgroundColor: '#D6F4FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    height: 50,
  },
  addNewAccountText: {
    marginTop: 2,
    color: '#00A5E0',
  },

  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },
});

export default AccountsList;
