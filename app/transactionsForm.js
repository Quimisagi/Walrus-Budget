import React, {useEffect} from 'react';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, Pressable } from "react-native";
import { getData, storeData } from "../src/storage"; 
import { useGlobal } from './_layout';
import CategoryModal from '../src/categoryModal';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import defaultCategories from '../defaultCategories';
import globalStyles from '../src/globalStyles';
import { AntDesign } from '@expo/vector-icons';

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

  const [selection, setSelection] = useState(-1);

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
  const processNumber = (text) => {
    if (text[0] === "$") {
      text = text.slice(1);
    }
    if (isNaN(parseFloat(text))) {
      setAmount(0);
    } else {
      setAmount(parseFloat(text));
    }
  };


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
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Amount:</Text>
      <TextInput
        style={globalStyles.inputFieldB}
        keyboardType="numeric"
        placeholder="$0.00"
        value={"$" + amount.toString()}
        onChangeText={(text) => processNumber(text)}
      />
      <Text style={globalStyles.label}>Transaction Type:</Text>
      <View style={styles.btnGroup}>
        <TouchableOpacity style={[styles.btn, selection === -1 ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(-1)}>
          <Text style={[styles.btnText, selection === -1 ? { color: "white" } : null]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, selection === 1 ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(1)}>
          <Text style={[styles.btnText, selection === 1 ? { color: "white" } : null]}>Income</Text>
        </TouchableOpacity>
      </View>
      <Text style={globalStyles.label}>Category:</Text>
      {category ? (
        <View>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>{category.name}</Text>
          </Pressable>
        </View>
      ) : (
        <Text> Select category </Text>
      )}
      <View style={globalStyles.hr} />
      <Text styles={globalStyles.label}>Notes:</Text>
      <TextInput
        style={globalStyles.inputField}
        value={notes}
        onChangeText={(text) => setNotes(text)}
      />
      <View style={globalStyles.row}>
        <View style={globalStyles.column}>
          <Text style={globalStyles.label}>Date</Text>
          <TouchableOpacity style={globalStyles.inputField} onPress={showDatepicker}>
            <View style={[globalStyles.row ]}>
              <AntDesign name="calendar" size={16} color="black" />
              <Text style={[globalStyles.dateLabel, {marginLeft: 5} ]}>{date}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.column}>
          <Text style={globalStyles.label}>Time:</Text>
          <TouchableOpacity style={globalStyles.inputField} onPress={showTimepicker}>
            <View style={globalStyles.row}>
              <AntDesign name="clockcircleo" size={16} color="black" />
              <Text style={[globalStyles.dateLabel, {marginLeft: 5} ]}>{time}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
  btnGroup: {
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    borderRightWidth: 0.25,
    borderLeftWidth: 0.25,
    borderColor: '#6B7280'
  },
  btnText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14
  }
});

export default TransactionsForm;
