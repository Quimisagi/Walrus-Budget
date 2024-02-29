import React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { storeData } from '../utils/storage';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const AccountType = {
  GENERAL         : "general",
  CASH            : "cash",
  CREDIT_CARD     : "credit_card",
  SAVINGS_ACCOUNT : "savings_account",
}

const AccountForm = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(AccountType.GENERAL);

  const { accounts, setAccounts } = useGlobal();

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
        id                  : uuidv4(),
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={sendData}
        >
          <AntDesign name="check" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, initialValue, name, type]);

  return(
    <View style={globalStyles.container}>
      <Text style={globalStyles.inputFieldLabel}>Name:</Text>
      <TextInput
        style={globalStyles.inputField}
        value={name}
        onChangeText={(text) => { setName(text)}}
      />
      <Text style={globalStyles.inputFieldLabel}>Initial value:</Text>
      <TextInput
        style={globalStyles.inputFieldB}
        keyboardType="numeric"
        placeholder="$0.00"
        value={"$" + initialValue.toString()}
        onChangeText={(text) => processNumber(text)}
      />
      <Text style={globalStyles.inputFieldLabel}>Type:</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={globalStyles.inputField}>{type}</Text>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
      >
        <View style={globalStyles.modal}>
          <TouchableOpacity onPress={() => { setType(AccountType.GENERAL); setModalVisible(false); }}>
            <Text style={globalStyles.modalText}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setType(AccountType.CASH); setModalVisible(false); }}>
            <Text style={globalStyles.modalText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setType(AccountType.CREDIT_CARD); setModalVisible(false); }}>
            <Text style={globalStyles.modalText}>Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setType(AccountType.SAVINGS_ACCOUNT); setModalVisible(false); }}>
            <Text style={globalStyles.modalText}>Savings Account</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default AccountForm;
