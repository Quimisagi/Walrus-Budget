import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Image, Text, View, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { storeData, getData } from '../src/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import globalStyles from '../src/globalStyles';
import { useGlobal } from './_layout';
import MonthPicker from 'react-native-month-year-picker';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { AntDesign } from '@expo/vector-icons';


const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

const BudgetForm = () => {
  const navigation = useNavigation();

  const [begginingBalance, setBegginingBalance] = useState(0);
  let currentDate = new Date();
  const [date, setDate] = useState(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
  const defaultName = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear() 
  const [name, setName] = useState(defaultName);
  const [dateInFormat, setDateInFormat] = useState(displayDateInFormat);

  const [isNameChanged, setIsNameChanged] = useState(false);

  const [showPicker, setShowPicker] = useState(false);

  const { budgets, setBudgets, setActiveBudget } = useGlobal();
  const { id, editMode } = useLocalSearchParams();

  const displayDateInFormat = (date) => {
    let dateArray = date.split("-");
    let month = monthNames[parseInt(dateArray[1]) - 1];
    setDateInFormat(month + " " + dateArray[0]);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    const currentDate = selectedDate || date;
    try {
      if (currentDate && currentDate instanceof Date && !isNaN(currentDate)) {
        setDate(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
        displayDateInFormat(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1));
        if (!isNameChanged) {
          const nameTemp = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();
          setName(nameTemp);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const createBudget = async () => {
    try {
      let newBudget = {
        id                  : uuidv4(),
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
      router.back();
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

  const processNumber = (text) => {
    if (text[0] === "$") {
      text = text.slice(1);
    }
    if (isNaN(parseFloat(text))) {
      setBegginingBalance(0);
    } else {
      setBegginingBalance(parseFloat(text));
    }
  };

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
    <View style={styles.container}>
      <Text style={globalStyles.inputFieldLabel}>Date:</Text>
      <TouchableOpacity style={globalStyles.inputField} onPress={() => { setShowPicker(true) }}>
        <View style={[globalStyles.dateLabel, globalStyles.row ]}>
          <AntDesign name="calendar" size={16} color="black" />
          <Text style={{marginLeft: 5}}>{dateInFormat}</Text>
        </View>
      </TouchableOpacity>
      {showPicker ? (
        <MonthPicker
          onChange={onChangeDate}
          value={new Date(date + "-05")}
          minimumDate={new Date(2000, 1)}
          maximumDate={new Date(2099, 12)}
          locale="en"
        />
      ) : null}
      <Text style={globalStyles.inputFieldLabel}>Name:</Text>
      <TextInput
        style={globalStyles.inputField}
        value={name}
        onChangeText={(text) => { setName(text); setIsNameChanged(true); }}
      />
      <Text style={globalStyles.inputFieldLabel}>Beginning Balance:</Text>
      <TextInput
        style={globalStyles.inputFieldB}
        keyboardType="numeric"
        placeholder="$0.00"
        value={"$" + begginingBalance.toString()}
        onChangeText={(text) => processNumber(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
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
