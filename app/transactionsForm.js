import React, {useEffect, useLayoutEffect, useRef} from 'react';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Pressable } from "react-native";
import { getData, storeData } from "../utils/storage"; 
import { useGlobal } from '../utils/globalProvider';
import CategoryModal from './components/categoryModal';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import defaultCategories from '../utils/defaultCategories';
import globalStyles from '../utils/globalStyles';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { processMoneyValue, formatMoney } from '../utils/numberUtils';
import Modal from "react-native-modal";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getContrastColor } from '../utils/iconsList';
import Toast from 'react-native-toast-message';
import { showCurrency } from '../utils/currency';
import { useTranslation } from 'react-i18next'; // ✅ added

const TransactionType = {
  EXPENSE: -1,
  INCOME: 1
};

const TransactionsForm = ({}) => {
  const { t } = useTranslation(); // ✅ added
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [amount, setAmount] = useState(0); 
  const [notes, setNotes] = useState('');
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
  const [time, setTime] = useState(currentDate.getHours() + ":" + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes());
  const [category, setCategory] = useState({});
  const [account, setAccount] = useState({});
  const [transactionType, setTransactionType] = useState(TransactionType.EXPENSE);
  const [selection, setSelection] = useState(-1);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const { 
    activeBudget,
    transactions,
    setTransactions,
    accounts,
    activeBudgetCategories,
    currency
  } = useGlobal();
  const { editMode, transactionId, categoryId, accountId } = params;
  const valueRef = useRef(null)

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate.toISOString().split('T')[0]);
  };
  const onChangeTime = (event, selectedTime) => {
    let timeTemp = selectedTime.getHours() + ":" + (selectedTime.getMinutes() < 10 ? '0' : '') + selectedTime.getMinutes()
    setTime(timeTemp);
  }

  const selectCategory = (category) => {
    setCategory(category);
    setCategoryModalVisible(false);
  } 

  const showDatepicker = () => {
    let parts = date.split("-");
    let dateTemp = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
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
    try {
      const transactionsTemp = [...transactions];
      transactionsTemp.push(newTransaction);
      await storeData('transactions', JSON.stringify(transactionsTemp));
      setTransactions(transactionsTemp);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: t('general.transaction_success'), // ✅
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('general.transaction_failed'), // ✅
        text2: error.message,
      });
    }
  };

  const updateTransaction = async (newTransaction) => {
    try {
      const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);
      if (transactionIndex === -1) throw new Error('Transaction not found');
      const arrayTemp = [...transactions];
      arrayTemp[transactionIndex] = newTransaction;
      setTransactions(arrayTemp);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: t('general.transaction_success'), // ✅ reuse for now
      });
      router.back();
    } catch (error) {
      console.error('Error updating transaction:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('general.transaction_failed'), // ✅
        text2: error.message,
      });
    }
  };

  const emptyForm = () => {
    setAmount(0);
    setNotes('');
    setDate(currentDate.toISOString().split('T')[0]);
    setTime(currentDate.getHours() + ":" + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes());
  }

  const sendData = async () => {
    try {
      let newTransaction = {
        id: uuid.v4(),
        amount,
        notes,
        date,
        time,
        categoryId: category?.id,
        accountId: account?.id,
        budgetId: activeBudget?.id,
        transactionType: selection,
      };

      if (editMode) await updateTransaction(newTransaction);
      else await createTransaction(newTransaction);

      emptyForm();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const focusValue = () => {
    if(valueRef.current){
      valueRef.current.focus();
    }
  }

  useEffect(() => {
    if(accountId){
      let accountTemp = accounts.find(account => account.id === accountId)
      setAccount(accountTemp);
    }
    if(categoryId){
      let categoryTemp = activeBudgetCategories.find(category => category.id ===  categoryId)
      setCategory(categoryTemp);
    }
    if(editMode){
      let transactionTemp = transactions.find(transaction => transaction.id === transactionId)
      if(transactionTemp){
        setAmount(transactionTemp.amount);
        setNotes(transactionTemp.notes);
        setDate(transactionTemp.date);
        setTime(transactionTemp.time);
        setTransactionType(transactionTemp.transactionType);
        setSelection(transactionTemp.transactionType);
        const categoryTemp = activeBudgetCategories.find(category => category.id === transactionTemp.categoryId);
        setCategory(categoryTemp);
        const accountTemp = accounts.find(account => account.id === transactionTemp.accountId);
        setAccount(accountTemp);
      }
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('screens.newTransaction'), // ✅ same title for now
      headerRight: () => (
        <TouchableOpacity style={{ margin: 15 }} onPress={sendData} disabled={amount <= 0 }>
          <AntDesign name="check" size={24} color= {amount <= 0 ? "gray" : "black"}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation, amount, notes, date, time, category, transactionType, account, selection]);

  return (
    <View style={globalStyles.container}>
      <View style={styles.btnGroup}>
        <TouchableOpacity style={[styles.btn, selection === -1 && { backgroundColor: "#DF3B57" }]} onPress={() => setSelection(-1)}>
          <Text style={[styles.btnText, globalStyles.h3, selection === -1 && { color: "white" }]}>{t('general.expense')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, selection === 1 && { backgroundColor: "#5FB49C" }]} onPress={() => setSelection(1)}>
          <Text style={[styles.btnText, globalStyles.h3, selection === 1 && { color: "white" }]}>{t('general.income')}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.block}>
        <TouchableOpacity onPress={focusValue}>
          <Text style={globalStyles.inputFieldB}>
            {(selection === -1 ? "-" : "+") + showCurrency(currency) + formatMoney(amount.toString())}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={globalStyles.inputFieldBInvisible}
          ref={valueRef}
          autoFocus={true}
          keyboardType="numeric"
          maxLength={18}
          placeholder="$0.00"
          value={"$" + amount.toString()}
          onChangeText={(text) => setAmount(processMoneyValue(text))}
        />
      </View>

      <View style={globalStyles.block}>
        <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => setCategoryModalVisible(true)}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            {category?.id ? (
              <View style={[styles.categoryIcon, {backgroundColor: category.color}]}>
                <FontAwesome6 name={category.icon} size={15} color={getContrastColor(category.color)} />
              </View>
            ) : (
              <FontAwesome6 name="shapes" size={16} color="gray" />
            )}
          </View>
          <TextInput style={[ globalStyles.inputField, {flex: 9} ]} pointerEvents="none" editable={false}>
            <Text style={{color: category?.id ? 'black' : 'gray'}}>
              {category?.id ? category.name : t('general.no_category')}
            </Text>
          </TextInput>
        </TouchableOpacity>

        <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => setAccountModalVisible(true)}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            <FontAwesome6 name="wallet" size={16} color="gray" />
          </View>
          <TextInput style={[ globalStyles.inputField, {flex: 9} ]} pointerEvents="none" editable={false}>
            <Text style={{color: account?.id ? 'black' : 'gray'}}>
              {account?.id ? account.name : t('general.no_account')}
            </Text>
          </TextInput>
        </TouchableOpacity>

        <View style={[ globalStyles.inputFieldContainer, globalStyles.row, {marginBottom: 15}]}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            <MaterialCommunityIcons name="text" size={16} color="black" />
          </View>
          <TextInput
            style={[ globalStyles.inputField, {flex: 9} ]}
            value={notes}
            placeholder={t('general.description')}
            onChangeText={setNotes}
            maxLength={24}
          />
        </View>

        <View style={globalStyles.row}>
          <View style={{flex:1, marginRight: 5}}>
            <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={showDatepicker}>
              <View style={[ globalStyles.centered, {flex:1} ]}>
                <AntDesign name="calendar" size={16} color="black" />
              </View>
              <TextInput style={[ globalStyles.inputField, {flex: 7} ]} pointerEvents="none" editable={false}>
                <Text style={{marginLeft: 30}}>{date}</Text>
              </TextInput>
            </TouchableOpacity>
          </View>
          <View style={{flex:1, marginLeft: 5}}>
            <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={showTimepicker}>
              <View style={[ globalStyles.centered, {flex:1} ]}>
                <AntDesign name="clockcircle" size={16} color="black" />
              </View>
              <TextInput style={[ globalStyles.inputField, {flex: 7} ]} pointerEvents="none" editable={false}>
                <Text style={{marginLeft: 30}}>{time}</Text>
              </TextInput>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal isVisible={isAccountModalVisible} onBackdropPress={() => setAccountModalVisible(false)}>
        <View style={globalStyles.modal}>
          <Text style={globalStyles.h2}>{t('general.accounts')}</Text>
          <View style={globalStyles.block}>
            {accounts.length > 0 ? (
              accounts.map(account => (
                <View key={account.id} style={styles.accountButton}>
                  <Pressable onPress={() => { setAccount(account); setAccountModalVisible(false); }}>
                    <View style={[globalStyles.row, styles.accountRow]}>
                      <Text style={[globalStyles.h3, styles.accountName]}>{account.name}</Text>
                      <Text style={[globalStyles.h3, styles.accountValue]}> - (${account.initialValue})</Text>
                    </View>
                  </Pressable>
                </View>
              ))
            ) : (
              <View style={styles.noAccountsMessage}>
                <Text style={globalStyles.h3}>{t('general.no_account')}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <CategoryModal 
        isVisible={isCategoryModalVisible} 
        onClose={() => setCategoryModalVisible(false)} 
        setCategory={selectCategory}
        categories={activeBudget.allocatedCategories}
        filterSelected={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    borderColor: '#6B7280'
  },
  btnText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountButton: {
    height: 40,
    borderRadius: 8,
    padding: 10,
  },
});

export default TransactionsForm;
