import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Image, Text, View, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { storeData, getData } from '../utils/storage';
import { useTranslation } from 'react-i18next';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { processMoneyValue, formatMoney } from '../utils/numberUtils';
import { displayDateInFormat } from '../utils/dateUtils';
import MonthPicker from 'react-native-month-year-picker';
import { showCurrency } from '../utils/currency';

const BudgetForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const budgetRef = useRef(null);
  const [begginingBalance, setBegginingBalance] = useState(0);
  let currentDate = new Date();
  const [date, setDate] = useState(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
  const [name, setName] = useState("");
  const [dateInFormat, setDateInFormat] = useState(displayDateInFormat(date));
  const [showPicker, setShowPicker] = useState(false);
  const { budgets, setBudgets, setActiveBudget, currency } = useGlobal();
  const { id, editMode } = useLocalSearchParams();

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    const currentDate = selectedDate || date;
    try {
      if (currentDate && currentDate instanceof Date && !isNaN(currentDate)) {
        setDate(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
        const dateInFormat = displayDateInFormat(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
        setDateInFormat(dateInFormat);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const createBudget = async () => {
    try {
      let newBudget = {
        id                  : uuid.v4(),
        begginingBalance    : begginingBalance,
        name                : name,
        date                : date,
        allocatedCategories : []
      };

      const budgetsTemp = [...budgets];
      budgetsTemp.push(newBudget);

      await storeData('budgets', JSON.stringify(budgetsTemp));
      await storeData('activeBudget', JSON.stringify(newBudget));

      setBudgets(budgetsTemp);
      setActiveBudget(newBudget);
      router.replace({ pathname: '/home' });
    } catch (error) {
      console.error("An error occurred while creating the budget:", error);
    }
  };

  const sendData = async () => {
    if (editMode) {
      let budgetsCopy = [...budgets];
      let index = budgetsCopy.findIndex(budget => budget.id === id);
      budgetsCopy[index].begginingBalance = begginingBalance;
      budgetsCopy[index].name = name;
      budgetsCopy[index].date = date;
      await storeData('budgets', JSON.stringify(budgetsCopy));
      setBudgets(budgetsCopy);
      router.back();
      return;
    }
    createBudget();
  };

  const focusBudget = () => {
    if(budgetRef.current){
      budgetRef.current.focus();
    }
  }

  useEffect(() => {
    displayDateInFormat(date);
    if (editMode) {
      const loadBudget = async () => {
        const budget = budgets.find(budget => budget.id === id);
        setBegginingBalance(budget.begginingBalance);
        setName(budget.name);
        setDate(budget.date);
      };
      loadBudget();
    }
  }
    , []);

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
  }, [navigation, begginingBalance, name, date]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>{t('general.budgeted_value')}</Text>
      <TouchableOpacity onPress={focusBudget}>
        <Text style={globalStyles.inputFieldB}>{showCurrency(currency) + formatMoney(begginingBalance.toLocaleString())}</Text>
      </TouchableOpacity>
      <TextInput
        style={globalStyles.inputFieldBInvisible}
        ref={budgetRef}
        autoFocus={true}
        maxLength={18}
        keyboardType="numeric"
        value={begginingBalance.toString()} // Removed $ for consistency
        onChangeText={(text) => setBegginingBalance(processMoneyValue(text))}
      />
      <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => { setShowPicker(true) }}>
        <View style={[ globalStyles.centered, {flex:1} ]}>
          <AntDesign name="calendar" size={16} color="black" />
        </View>
        <TextInput 
          style={[ globalStyles.inputField, {flex: 9} ]}
          pointerEvents="none"
          editable={false}
        >
          <Text style={{marginLeft: 30}}>{dateInFormat}</Text>
        </TextInput>
      </TouchableOpacity>
      {showPicker && (
        <MonthPicker
          onChange={onChangeDate}
          value={new Date(date + "-05")} // Assuming date is 'YYYY-MM'
          minimumDate={new Date(2000, 0)} // Month is 0-indexed
          maximumDate={new Date(2099, 11)} // Month is 0-indexed
          locale="en" // This could also be dynamic based on current language
        />
      )}
      <View style={[ globalStyles.inputFieldContainer, globalStyles.row ]}> 
        <View style={[ globalStyles.centered, {flex:1} ]}>
          <MaterialCommunityIcons name="text" size={16} color="black" />
        </View>
        <TextInput
          style={[ globalStyles.inputField, {flex: 9}]}
          placeholder='Custom name (optional)' // Left as is, requires new key budgetForm.customNamePlaceholder
          value={name}
          onChangeText={(text) => { setName(text); }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "50%",
    margin: 10,
  },
});

export default BudgetForm;
