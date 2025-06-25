import React, {useEffect, useLayoutEffect, useRef} from 'react';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Pressable, FlatList } from "react-native";
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
// import { useTranslation } from 'react-i18next'; // Assuming you might re-enable this


const TransactionType = {
  EXPENSE: -1,
  INCOME: 1
};

const TransactionsForm = ({}) => {
  // const { t } = useTranslation(); // Assuming you might re-enable this
  const t = (key) => key.split('.')[1].replace('_', ' '); // Placeholder for translation

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    try {
      const transactionsTemp = [...transactions];
      transactionsTemp.push(newTransaction);
      await storeData('transactions', JSON.stringify(transactionsTemp));
      setTransactions(transactionsTemp);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: t('general.transaction_success'),
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('general.transaction_failed'),
        text2: error.message,
      });
    }
  };

  const updateTransaction = async (newTransaction) => {
    try {
      const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);
      if (transactionIndex === -1) {
        throw new Error('Transaction not found');
      }
      const arrayTemp = [...transactions];
      arrayTemp[transactionIndex] = newTransaction;
      // await storeData('transactions', JSON.stringify(arrayTemp)); // This should be done in setTransactions or a dedicated save function
      setTransactions(arrayTemp);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: t('general.transaction_success'),
      });
      router.back();
    } catch (error) {
      console.error('Error updating transaction:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('general.transaction_failed'),
        text2: error.message,
      });
    }
  };

  const emptyForm = () => {
    setAmount(0);
    setNotes('');
    setDate(currentDate.toISOString().split('T')[0]);
    setTime(currentDate.getHours() + ":" + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes());
    // Reset category and account if needed
    // setCategory({});
    // setAccount({});
  }

const sendData = async () => {
  try {
    let newTransaction = {
      id: editMode ? transactionId : uuid.v4(), // Reuse ID if editing
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

    if (!editMode) { // Only empty form if not editing, so user can see their changes
        emptyForm();
    } else {
        router.back(); // Or navigate somewhere else after editing
    }
  } catch (e) {
    alert('Error: ' + e.message);
  }
};

  const focusValue = () => {
    if(valueRef.current){
      valueRef.current.focus();
    }
  }

  const handleNotesChange = (text) => {
    setNotes(text);
    if (text.trim().length > 0) {
      const uniqueNotes = [...new Set(
        transactions
          .map(t => t.notes)
          .filter(n => n && n.toLowerCase().startsWith(text.toLowerCase()))
      )].slice(0, 5); // Limit to 5 suggestions
      setSuggestions(uniqueNotes);
      setShowSuggestions(uniqueNotes.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setNotes(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if(accountId){
      let accountTemp = accounts.find(account => account.id === accountId)
      setAccount(accountTemp || {}); // Ensure account is an object
    }
    if(categoryId){
      let categoryTemp = activeBudgetCategories.find(category => category.id ===  categoryId)
      setCategory(categoryTemp || {}); // Ensure category is an object
    }
    if(editMode){
      let transactionTemp = transactions.find(transaction => transaction.id === transactionId)
      if(typeof transactionTemp !== 'undefined'){
        setAmount(transactionTemp.amount);
        setNotes(transactionTemp.notes)
        setDate(transactionTemp.date);
        setTime(transactionTemp.time);
        setTransactionType(transactionTemp.transactionType);
        setSelection(transactionTemp.transactionType);
        const categoryTemp = activeBudgetCategories.find(category => category.id === transactionTemp.categoryId);
        setCategory(categoryTemp || {}); // Ensure category is an object
        const accountTemp = accounts.find(account => account.id === transactionTemp.accountId);
        setAccount(accountTemp || {}); // Ensure account is an object
      }
    }
  }, [accountId, categoryId, editMode, transactionId, accounts, activeBudgetCategories, transactions]); // Added dependencies

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: editMode ? t('screens.editTransaction') : t('screens.newTransaction'), // Using placeholder t
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={sendData}
          disabled={amount <= 0 || !category?.id || !account?.id || selection === 0 } // Basic validation
        >
          <AntDesign name="check" size={24} color= {amount <= 0 || !category?.id || !account?.id || selection === 0 ? "gray" : "black"}/>
        </TouchableOpacity>
      ),

    });
  }, [navigation, amount, notes, date, time, category, account, selection, editMode, t]); // Added dependencies

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
          value={amount === 0 ? "" : amount.toString()} // Show placeholder correctly
          onChangeText={(text) => setAmount(processMoneyValue(text))}
        />
      </View>

      <View style={globalStyles.block}>
        <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => { setCategoryModalVisible(true) }}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            {category && Object.keys(category).length > 0 && category.icon ? (
              <View style={[styles.categoryIcon, {backgroundColor: category.color || '#ccc'}]}>
                <FontAwesome6 name={category.icon} size={15} color={getContrastColor(category.color || '#ccc')} />
              </View>
            ) : (
              <FontAwesome6 name="shapes" size={16} color="gray" />
            )}
          </View>
          <TextInput
            style={[ globalStyles.inputField, {flex: 9} ]}
            pointerEvents="none"
            editable={false}
            value={category && Object.keys(category).length > 0 ? category.name : t('general.no_category')}
            placeholderTextColor="gray"
          />
        </TouchableOpacity>

        <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => { setAccountModalVisible(true) }}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            <FontAwesome6 name="wallet" size={16} color="gray" />
          </View>
          <TextInput
            style={[ globalStyles.inputField, {flex: 9} ]}
            pointerEvents="none"
            editable={false}
            value={account && Object.keys(account).length > 0 ? account.name : t('general.no_account')}
            placeholderTextColor="gray"
          />
        </TouchableOpacity>

        <View style={[ globalStyles.inputFieldContainer, globalStyles.row, {marginBottom: 0}]}>
          <View style={[ globalStyles.centered, {flex:1} ]}>
            <MaterialCommunityIcons name="text" size={16} color="black" />
          </View>
          <TextInput
            style={[ globalStyles.inputField, {flex: 9} ]}
            value={notes}
            placeholder={t('general.description')}
            onChangeText={handleNotesChange} // Changed here
            maxLength={24}
            onBlur={() => setShowSuggestions(false)} // Hide suggestions on blur
          />
        </View>
        {showSuggestions && suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsContainer}
            nestedScrollEnabled={true} // Important for ScrollView conflicts
          />
        )}

        <View style={[globalStyles.row, {marginTop: 15}]}>
          <View style={{flex:1, marginRight: 5}}>
            <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => { showDatepicker() }}>
              <View style={[ globalStyles.centered, {flex:1} ]}>
                <AntDesign name="calendar" size={16} color="black" />
              </View>
              <TextInput
                style={[ globalStyles.inputField, {flex: 7} ]}
                pointerEvents="none"
                editable={false}
                value={date}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex:1, marginLeft: 5}}>
            <TouchableOpacity style={[ globalStyles.inputFieldContainer, globalStyles.row]} onPress={() => { showTimepicker() }}>
              <View style={[ globalStyles.centered, {flex:1} ]}>
                <AntDesign name="clockcircle" size={16} color="black" />
              </View>
              <TextInput
                style={[ globalStyles.inputField, {flex: 7} ]}
                pointerEvents="none"
                editable={false}
                value={time}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        isVisible={isAccountModalVisible}
        onBackdropPress={() => setAccountModalVisible(false)}
        // onClose={() => setAccountModalVisible(false)} // onBackdropPress is usually enough
      >
        <View style={globalStyles.modal}>
          <Text style={globalStyles.h2}>{t('general.select_account')}</Text>
          <View style={globalStyles.block}>
            {accounts.length > 0 ? (
              accounts.map(acc => ( // Changed variable name to avoid conflict
                <View key={acc.id} style={styles.accountButton}>
                  <Pressable onPress={() => { setAccount(acc); setAccountModalVisible(false); }}>
                    <View style={[globalStyles.row, styles.accountRow]}>
                      <Text style={[globalStyles.h3, styles.accountName]}>{acc.name}</Text>
                      {acc.initialValue && <Text style={[globalStyles.h3, styles.accountValue]}> - ({showCurrency(currency)}{formatMoney(acc.initialValue.toString())})</Text>}
                    </View>
                  </Pressable>
                </View>
              ))
            ) : (
              <View style={styles.noAccountsMessage}>
                <Text style={globalStyles.h3}>{t('general.no_accounts_registered')}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        setCategory={(cat) => selectCategory(cat)} // Ensure 'cat' is used to avoid conflict
        categories={activeBudgetCategories} // Assuming this is already filtered or should be
        filterSelected={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Removed unused input, button, categoryButton styles
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
    borderRadius: 15, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountButton: {
    // Consider renaming or ensuring it's distinct from other buttons if styles clash
    // height: 40, // Already in globalStyles.inputFieldContainer?
    borderRadius: 8,
    paddingVertical: 10, // Ensure text is vertically centered
    paddingHorizontal: 5,
  },
  accountRow: { // Added for better alignment in account modal
    alignItems: 'center',
  },
  accountName: {
    flex: 1, // Allow name to take available space
  },
  accountValue: {
    marginLeft: 5, // Space out name and value
  },
  noAccountsMessage: { // Added for styling the no accounts message
    padding: 20,
    alignItems: 'center',
  },
  suggestionsContainer: {
    maxHeight: 150, // Limit height
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    position: 'absolute', // Position it over other content
    left: 0,
    right: 0,
    top: '100%', // Position below the text input block (approximate)
    zIndex: 1000, // Ensure it's on top
    marginLeft: 10, // Align with globalStyles.block padding
    marginRight: 10,
    // Adjust top position based on the actual layout of the notes input field
    // This might need to be calculated or adjusted based on the surrounding elements.
    // For a quick fix, you might need to wrap the TextInput and FlatList in a View
    // and manage positioning within that View.
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    // Position it absolutely to overlay other content if needed.
    // This might require wrapping the TextInput and FlatList in a View
    // and managing zIndex or absolute positioning carefully.
    // For now, it will flow in document order.
    marginLeft: 10,
    marginRight: 10,
    marginTop: 2, // Small space between input and suggestions
  },
});

export default TransactionsForm;
