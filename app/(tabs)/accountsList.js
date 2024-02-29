import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import globalStyles from '../../utils/globalStyles';
import { useRouter} from "expo-router";
import { getData, storeData } from "../../utils/storage"; 
import { useGlobal } from '../../utils/globalProvider';
import { Feather, AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import SwipeableItem from '../../utils/swipeableItem';



const AccountsList = () => {

  const router = useRouter();
  const { accounts, setAccounts } = useGlobal();

  const goToEditBudget = (id) => {
    router.push({pathname: 'budgetForm', params: { editMode: true, id: id } });
  }

  deleteAccount = async (id) => {
    let accountsTemp = accounts.filter(account => account.id !== id);
    await storeData('accounts', JSON.stringify(accountsTemp));
    setAccounts(accountsTemp);
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Account deleted',
    });
  }

  return (
    <View style={globalStyles.container}> 
      <ScrollView>
        { accounts ? 
            (
              accounts.map(account => (
                <SwipeableItem key={account.id} onDelete={() => deleteAccount(account.id)}>
                  <TouchableOpacity>
                    <View style={[ globalStyles.transactionContainer, {padding: 10, paddingLeft: 20} ]}>
                      <View style={globalStyles.row}>
                        <View style={{flex: 3}}>
                        <Text style={globalStyles.h2}>{account.name}</Text>
                          <View style={globalStyles.row}>
                          <Text style={globalStyles.text}>{account.type}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1}}>
                        <Text style={globalStyles.amount}>${account.initialValue}</Text>
                        </View>
                      </View>
                    </View>
                </TouchableOpacity>
                </SwipeableItem>
              ))
            ) : 
            (
              <Text>No accounts</Text>
            ) 
        }
      </ScrollView>
      <TouchableOpacity style={globalStyles.addButton} onPress={() => router.push({ pathname: '/accountForm'})}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

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

export default AccountsList;
