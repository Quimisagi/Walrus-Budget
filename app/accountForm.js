import React from 'react';
import { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { storeData } from '../utils/storage';
import { AntDesign } from '@expo/vector-icons';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import { processMoneyValue, formatMoney } from '../utils/numberUtils';
import {MaterialCommunityIcons } from '@expo/vector-icons';
import {showCurrency} from '../utils/currency';


const AccountType = {
  GENERAL         : "general",
  CASH            : "cash",
  CREDIT_CARD     : "credit_card",
  SAVINGS_ACCOUNT : "savings_account",
}

const AccountForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const [type, setType] = useState(AccountType.GENERAL);
  const budgetRef = useRef(null);


  const { accounts, setAccounts, currency } = useGlobal();

  const processNumber = (text) => {
    if (text[0] === "$") {
      text = text.slice(1);
    }
    if (isNaN(parseFloat(text))) {
      setInitialValue(0);
    } else {
      setInitialValue(parseFloat(text));
    }
  };

  const sendData = async () => {
    try {
      let newAccount = {
        id                  : uuid.v4(),
        initialValue        : initialValue,
        name                : name,
        type                : type,
      };

      const accountsTemp = [...accounts];
      accountsTemp.push(newAccount);

      await storeData('accounts', JSON.stringify(accountsTemp));

      setAccounts(accountsTemp);
      router.back();
    } catch (error) {
      console.error("An error occurred while creating the budget:", error);
    }
  };

  const focusBudget = () => {
    if(budgetRef.current){
      budgetRef.current.focus();
    }
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={sendData}
          disabled={!name}
        >
          <AntDesign name="check" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, initialValue, name, type]);

  return(
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>{t('general.budgeted_value')}</Text>
      <TouchableOpacity onPress={focusBudget}>
        <Text style={globalStyles.inputFieldB}>{showCurrency(currency) + formatMoney(initialValue.toString())}</Text>
      </TouchableOpacity>
      <TextInput
        style={globalStyles.inputFieldBInvisible}
        ref={budgetRef}
        autoFocus={true}
        keyboardType="numeric"
        maxLength={12}
        value={initialValue.toString()} // Removed $ for consistency with processMoneyValue
        onChangeText={(text) => setInitialValue(processMoneyValue(text))}
      />
      <View style={[ globalStyles.inputFieldContainer, globalStyles.row, styles.name]}> 
        <View style={[ globalStyles.centered, {flex:1} ]}>
          <MaterialCommunityIcons name="text" size={16} color="black" />
        </View>
        <TextInput
          style={[ globalStyles.inputField, {flex: 9}]}
          placeholder={t('general.account_name')}
          value={name}
          maxLength={24}
          onChangeText={(text) => { setName(text); }}
        />
      </View>

    </View>
  )
}

const styles = {
  name: {
    marginTop: 7.5,
  }
}

export default AccountForm;
