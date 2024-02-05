import React, {useEffect} from 'react';
import { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, TextInput, Button, Pressable } from "react-native";
import { getData, storeData } from "../src/storage"; 
import { useGlobal } from './_layout';
import CategoryModal from '../src/categoryModal';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import defaultCategories from '../defaultCategories';

const TransactionType = {
  EXPENSE: -1,
  INCOME: 1
};

const TransactionsForm = ({}) => {
  const params = useLocalSearchParams();

  const [amount, setAmount] = useState(0); 
  const [notes, setNotes] = useState('');
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
  const [time, setTime] = useState(currentDate.getHours() + ":" + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes());
  const [category, setCategory] = useState({});
  const [transactionType, setTransactionType] = useState(TransactionType.EXPENSE);

  const [isModalVisible, setModalVisible] = useState(false);

  const { activeBudget, transactions, setTransactions} = useGlobal();

  const { editMode, transactionId } = params;

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate.toISOString().split('T')[0]);
  };
  const onChangeTime = (event, selectedTime) => {
    let timeTemp = selectedTime.getHours() + ":" + (selectedTime.getMinutes() < 10 ? '0' : '') + selectedTime.getMinutes()
    setTime(timeTemp);
  }
  const selectCategory = (category) => {
    setCategory(category);
    setModalVisible(false);
  } 
  const showDatepicker = () => {
    let parts = date.split("-");
    let dateTemp = new Date(
      parseInt(parts[0]), // Year
      parseInt(parts[1]) - 1, // Month (months are 0-indexed)
      parseInt(parts[2]) // Day
    )
    DateTimePickerAndroid.open({
      value: new Date(dateTemp),
      onChange: onChangeDate,
      mode: 'date',
      is24Hour: true,
    });
  };

  const showTimepicker = () => { 
    var customTime = new Date();
    if(typeof time !== "undefined"){
      var [hours, minutes] = time.split(':');
      customTime.setHours(parseInt(hours, 10));
      customTime.setMinutes(parseInt(minutes, 10));
    }

    DateTimePickerAndroid.open({
      value: customTime,
      onChange: onChangeTime,
      mode: 'time',
      is24Hour: true,
    });
  };

  const createTransaction = async (newTransaction) => {
    const transactionsTemp = [...transactions];
    transactionsTemp.push(newTransaction);
    await storeData('transactions', JSON.stringify(transactionsTemp));
    setTransactions(transactionsTemp);
    router.back();
  }

  const updateTransaction = async (newTransaction) => {
    let transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId)
    const arrayTemp = [...transactions];
    arrayTemp[transactionIndex] = newTransaction;
    await storeData('transactions', JSON.stringify(arrayTemp));
    setTransactions(arrayTemp);
    router.back();

  }

  const sendData = () => {
    let newTransaction = {
      id                   : uuidv4(),
      amount               : amount,
      notes                : notes,
      date                 : date,
      time                 : time,
      categoryId           : category.id,
      budgetId             : activeBudget.id,
      transactionType      : transactionType
    };
    if(editMode){
      updateTransaction(newTransaction);
      return;
    }
    else createTransaction(newTransaction);
  }


  useEffect(() => {
    if(editMode){
      let transactionTemp = transactions.find(transaction => transaction.id === transactionId)
      if(typeof transactionTemp !== 'undefined'){
        setAmount(transactionTemp.amount);
        setNotes(transactionTemp.notes);
        setDate(transactionTemp.date);
        setTime(transactionTemp.time);
        let category = defaultCategories.find(category => category.id === transactionTemp.categoryId)
        setCategory(category);
        setTransactionType(transactionTemp.transactionType);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Amountaaa:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={(text) => isNaN(parseFloat(text)) ? setAmount(0) : setAmount(parseFloat(text))}
      />

      <Text>Notes:</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={(text) => setNotes(text)}
      />

      <Text>Date (MM/DD/YYYY):</Text>
      <Button
        title="Select Date"
        onPress={showDatepicker}
      />

      <Text>Time:</Text>
      <Button
        title="Select Time"
        onPress={showTimepicker}
      />
      <Text>Category:</Text>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>{category.name}</Text>
      </Pressable>

      <CategoryModal 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        setCategory={(category) => selectCategory (category)}
        categories={activeBudget.allocatedCategories}
        filterSelected={true}
      />
      <Button
        title="Create Transaction"
        disabled={Object.keys(category).length === 0}
        onPress={() => {
          sendData();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 12,
  },
  categoryButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 12,
  },
});

export default TransactionsForm;
