import React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import defaultCategories from '../utils/defaultCategories';
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { storeData } from '../utils/storage';
import { AntDesign } from '@expo/vector-icons';

const AccountType = {
  GENERAL         : 0,
  CASH            : 1,
  CREDIT_CARD     : 2,
  SAVINGS_ACCOUNT : 3,
}

const AccountForm = () => {
  const [name, setName] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const [type, setType] = useState(AccountType.GENERAL);

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


  return(
    <View style={globalStyles.container}>
      <Text style={globalStyles.inputFieldLabel}>Name:</Text>
      <TextInput
        style={globalStyles.inputField}
        value={name}
        onChangeText={(text) => { setName(text); setIsNameChanged(true); }}
      />
      <Text style={globalStyles.inputFieldLabel}>Initial value:</Text>
      <TextInput
        style={globalStyles.inputFieldB}
        keyboardType="numeric"
        placeholder="$0.00"
        value={"$" + initialValue.toString()}
        onChangeText={(text) => processNumber(text)}
      />


    </View>

  )
}
