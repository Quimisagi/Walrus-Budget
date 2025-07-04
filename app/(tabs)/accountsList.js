import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import globalStyles from '../../utils/globalStyles';
import { useRouter, useNavigation } from "expo-router";
import { getData, storeData } from "../../utils/storage"; 
import { useGlobal } from '../../utils/globalProvider';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import SwipeableItem from '../../utils/swipeableItem';
import { formatMoney } from '../../utils/numberUtils';
import { showCurrency } from '../../utils/currency';

const AccountsList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const { accounts, setAccounts, transactions, currency } = useGlobal();

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
      text1: t('general.account_delete_success'),
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
        <Text style={globalStyles.h2}>{t('general.accounts')}</Text>
      </View>
      <ScrollView>
        <TouchableOpacity
          style={[globalStyles.row, globalStyles.mainActionButton]}
          onPress={() => router.push({ pathname: '/accountForm'})}
        >
          <View style={{flex: 4}}>
          </View>
          <View style={{flex: 2}}>
            <Ionicons name="add-circle-outline" size={30} color={'#00A5E0'} />
          </View>
          <View style={{flex: 6}}>
            <Text style={[globalStyles.h3, globalStyles.mainActionButtonText]}>{t('screens.newAccount')}</Text>
          </View>
          <View style={{flex: 4}}>
          </View>
        </TouchableOpacity>
        { accounts && accounts.length > 0 ?
            (
              updatedAccounts.map(account => (
                <TouchableOpacity 
                  key={account.id}
                  onPress={() => router.push({ pathname: ('/accountDetails/' + account.id) })} 
                >
                  <View style={[ globalStyles.transactionContainer, {padding: 10, paddingLeft: 20} ]}>
                    <View style={globalStyles.row}>
                      <View style={{flex: 4}}>
                        <Text></Text>
                        <Text style={globalStyles.h2}>{account.name}</Text>
                        <Text></Text>
                      </View>
                      <View style={[ {flex: 6}, globalStyles.centered ]}>
                        <View style={globalStyles.row}>
                          <Text style={[ globalStyles.h3, {marginTop: 5} ]}>{t('general.balance')}   </Text>
                          <Text style={globalStyles.amount}>{showCurrency(currency)}{formatMoney(account.balance.toLocaleString())}</Text>
                        </View>
                        <Text style={styles.smallText}>{t('general.initialValue')}: {showCurrency(currency)}{formatMoney(account.initialValue.toLocaleString())}</Text>
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
    marginTop: 20,
    padding: 30,
    flex: 1
  },
  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
});

export default AccountsList;
