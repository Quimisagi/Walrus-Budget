import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobal } from '../../utils/globalProvider';
import globalStyles from '../../utils/globalStyles';
import CategoryModal from '../components/categoryModal';
import { router } from 'expo-router';
import CategoriesList from '../components/categoriesList';
import TransactionList from '../components/transactionsList';
import { Ionicons, Feather, FontAwesome6 } from '@expo/vector-icons';
import { displayDateInFormat } from '../../utils/dateUtils';
import { calculateExpenses, calculateIncome, formatMoney, calculateBudgetedInCategories } from '../../utils/numberUtils';
import { showCurrency } from '../../utils/currency';
import 'react-native-get-random-values'; // Needed for uuid
import uuid from 'react-native-uuid';
import { getData, storeData } from '../../utils/storage';
import ConfirmBudgetNameModal from '../components/confirmBudgetNameModal'; 



import * as Font from 'expo-font';

Font.loadAsync({
  'PlusJakarta': require('../../assets/fonts/PlusJakartaSans.ttf'),
});


export default function Home() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { 
    budgets,
    transactions,
    categories,
    activeBudget,
    activeBudgetTransactions,
    setActiveBudgetTransactions,
    activeBudgetCategories,
    setActiveBudgetCategories,
    isSwiping,
    setIsSwiping,
    currency,
    setBudgets, // Added for updating global state
    setCategories, // Added for updating global state
    setActiveBudget, // Added for setting the new budget as active
  } = useGlobal();

  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [budgetedInCategories, setBudgetedInCategories] = useState(0);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false); // Renamed for clarity
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [newBudgetNameInput, setNewBudgetNameInput] = useState('');

  const calculateBalance = (balance, transactions) => {
    transactions.forEach(transaction => {
      balance += transaction.amount * transaction.transactionType;
    });
    return balance;
  }

  const toAddCategory = (category ) => {
    router.push({ pathname: '/categoryForm', params: { categoryId: category.id, activeBudgetId: activeBudget.id } });
    setCategoryModalVisible(false);
  }

  useEffect(() => {
    navigation.setOptions({headerShown: false });
  }, []);

  useEffect(() => {
    if(activeBudget){
      setInitialValue(activeBudget.begginingBalance);
      setBudgetedInCategories(calculateBudgetedInCategories(activeBudgetCategories));
      setExpenses(calculateExpenses(activeBudgetTransactions));
      setIncome(calculateIncome(activeBudgetTransactions));
      setBalance(calculateBalance(activeBudget.begginingBalance, activeBudgetTransactions));
    } 
  }, [activeBudget, budgets, transactions, activeBudgetTransactions, activeBudgetCategories]);

  useEffect(() => {
    if(activeBudget){
      setActiveBudgetTransactions(transactions.filter(transaction => transaction.budgetId === activeBudget.id));
    }
  }, [transactions, activeBudget]);

  useEffect(() => {
    if(activeBudget){
      setActiveBudgetCategories(categories.filter(category => category.budgetId === activeBudget.id));
    }
  }, [categories, activeBudget]);

  const copyBudget = async (confirmedName) => {
    if (!activeBudget) {
      console.log("No active budget to copy.");
      return;
    }

    if (!confirmedName || confirmedName.trim() === '') {
      console.log("Budget name cannot be empty.");
      // Optionally, alert the user, though the modal should prevent this.
      return;
    }

    try {
      const currentDate = new Date();
      const newBudgetId = uuid.v4();
      // Use the name from the modal confirmation
      const newBudgetName = confirmedName;

      // Create new categories with new IDs and updated budgetId
      const newAllocatedCategories = activeBudgetCategories.map(category => ({
        ...category,
        id: uuid.v4(), // New unique ID for the copied category
        budgetId: newBudgetId, // Link to the new budget
        currentAmount: 0, // Reset current amount for the new budget's category
        // transactions field is intentionally omitted to not copy transactions
      }));

      const newBudget = {
        id: newBudgetId,
        begginingBalance: activeBudget.begginingBalance,
        name: newBudgetName,
        date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
        allocatedCategories: newAllocatedCategories.map(cat => cat.id) // Store only category IDs as per original budgetForm structure (if applicable, or adjust if storing full objects)
      };
      // It seems budgetForm.js initializes allocatedCategories as an empty array,
      // but categories are linked via category.budgetId.
      // For consistency, let's ensure newBudget.allocatedCategories is an array of the new category IDs.
      // The global state and storage for categories will be updated separately.

      // Update global state and storage for budgets
      const updatedBudgets = [...budgets, newBudget];
      setBudgets(updatedBudgets);
      await storeData('budgets', JSON.stringify(updatedBudgets));

      // Update global state and storage for categories
      const updatedCategories = [...categories, ...newAllocatedCategories];
      setCategories(updatedCategories);
      await storeData('categories', JSON.stringify(updatedCategories));

      // Set the new budget as active
      setActiveBudget(newBudget);
      await storeData('activeBudget', JSON.stringify(newBudget));

      //setActiveBudgetCategories will be updated by useEffect when activeBudget changes

      console.log("Budget copied successfully:", newBudget.name);
      router.push({ pathname: '/home' }); // Refresh or navigate to ensure UI updates

    } catch (error) {
      console.error("Error copying budget:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {budgets.length === 0 ? (
          <View>

          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={[ globalStyles.row, globalStyles.centered ]}>
              <TouchableOpacity 
                style={{flex : 1, marginLeft: 5}}
                onPress={() => router.push({ pathname: '/settings' })}
              >
                <FontAwesome6 name="wrench" size={25} color="black" />
              </TouchableOpacity>
              <View style={{flex: 5}}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/budgetsList' })}>
                  <View style={[globalStyles.row, styles.budgetSelectMenu, globalStyles.centered]}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -15}}>
                      <Ionicons name="caret-down" size={18} color="black" style={{marginRight: 5}} />
                      <Text style={globalStyles.h2}>
                        {activeBudget.name ? activeBudget.name : displayDateInFormat(activeBudget.date)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{flex : 1, marginLeft: 10, alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    if (activeBudget) {
                      const suggestedName = activeBudget.name ? `${activeBudget.name} (Copy)` : `${displayDateInFormat(new Date().getFullYear() + "-" + (new Date().getMonth() + 1))}`;
                      setNewBudgetNameInput(suggestedName);
                      setIsNameModalVisible(true);
                    } else {
                      // Consider adding a key like 'general.no_active_budget_to_copy' later.
                      alert(t('general.budget_failed') + " - No active budget to copy.");
                    }
                  }}
                >
                  <FontAwesome6 name="copy" size={25} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView scrollEnabled={!isSwiping} style={{ flex: 1 }}>
              <View style={styles.homeContent}>
                <View style={styles.currentBudget}>
                  <View style={globalStyles.row}>
                    <View style={[globalStyles.column, globalStyles.centered]}>

                      {/* Balance title */}
                      <View style={globalStyles.row}>
                        <Text style={globalStyles.h3}>{t('general.balance')}</Text>
                      </View>

                      {/* Income */}
                      <View style={[globalStyles.row, globalStyles.centered, { marginBottom: -10, marginTop: 10 }]}>
                        <View style={{ flex: 4 }} />
                        <View style={[globalStyles.row, globalStyles.centered] }>
                          <Feather style={[ styles.totalIncome, {paddingTop: 5, marginHorizontal: 5} ]} name="arrow-down-left" />
                          <Text style={styles.totalIncome}>+{showCurrency(currency)}{formatMoney(income.toLocaleString())}</Text>
                        </View>
                        <View style={{ flex: 4 }} />
                      </View>

                      {/* Balance amount */}
                      <View style={globalStyles.row}> 
                        <Text style={globalStyles.balance}>{showCurrency(currency)}{formatMoney(balance.toLocaleString())}</Text>
                      </View>

                      {/* Expenses */}
                      <View style={[globalStyles.row, globalStyles.centered]}>
                        <View style={{ flex: 4 }} />
                        <View style={[ globalStyles.row, globalStyles.centered ] }>
                          <Feather style={[ styles.totalExpenses, {paddingTop: 5, marginHorizontal: 5} ]} name="arrow-up-right" />
                          <Text style={styles.totalExpenses}>-{showCurrency(currency)}{formatMoney(expenses.toLocaleString())}</Text>
                        </View>
                        <View style={{ flex: 4 }} />
                      </View>
                    </View>
                  </View>
                  <View style={[globalStyles.row, styles.homeContent]}>
                    <View style={[ globalStyles.column, globalStyles.centered, styles.circleSection ]}>
                      <View style={[ globalStyles.row ]}>
                        <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>{t('general.initialValue')}</Text>
                      </View>
                      <View style={globalStyles.row}>
                        <Text style={styles.value}>{showCurrency(currency)}{formatMoney(initialValue.toLocaleString())}</Text>
                      </View>
                    </View>
                    <View style={[ globalStyles.column, globalStyles.centered, styles.circleSection ]}>
                      <View style={[ globalStyles.row]}>
                        <Text style={[ globalStyles.h3, {textAlign: 'center'} ]}>{t('general.budgeted')}</Text>
                      </View>

                      <View style={globalStyles.row}>
                        <Text style={styles.value}>{showCurrency(currency)}{formatMoney(budgetedInCategories.toLocaleString())}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.homeContent}>
                  <CategoriesList
                    openModal={() => setCategoryModalVisible(true)}
                  />
                  <TransactionList/>
                  <CategoryModal
                    isVisible={isCategoryModalVisible}
                    onClose={() => setCategoryModalVisible(false)}
                    setCategory={(category) => toAddCategory(category)}
                    categories={activeBudget?.allocatedCategories || []}
                    filterSelected={false}
                  />
                </View>
              </View>
            </ScrollView>
            <ConfirmBudgetNameModal
              isVisible={isNameModalVisible}
              onClose={() => setIsNameModalVisible(false)}
              onConfirm={(name) => {
                copyBudget(name); // We'll modify copyBudget to accept name next
                setIsNameModalVisible(false);
              }}
              initialName={newBudgetNameInput}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 25,
    padding: 10,
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    width: '95%'
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  noBudgetsPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 48,
    fontFamily: 'PlusJakarta',
  },
  totalExpenses: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
    color: '#FB5A4B',
    textAlign: 'center',
  },
  totalIncome: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
    color: '#1C9B4F',
  },
  value: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
  },
  budgetSelectMenu: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
  homeContent: {
    marginTop: 20,
  },
  walrus: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes content to the bottom
  },
  circleSection: {
    borderRadius: 100,
    width: 80,
    height: 80,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
