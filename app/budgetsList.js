import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import globalStyles from '../utils/globalStyles';
import { useTranslation } from 'react-i18next';
import { useRouter } from "expo-router";
import { storeData } from "../utils/storage"; 
import { useGlobal } from '../utils/globalProvider';
import { Feather } from '@expo/vector-icons';
import { displayDateInFormat } from '../utils/dateUtils';
import { showCurrency } from '../utils/currency';
import SwipeableItem from '../utils/swipeableItem';

const BudgetsList = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { budgets, setBudgets, activeBudget, setActiveBudget, currency } = useGlobal();

  const goToEditBudget = (id) => {
    router.push({ pathname: 'budgetForm', params: { editMode: true, id } });
  }

  const updateActiveBudget = async (budget) => {
    await storeData('activeBudget', JSON.stringify(budget));
    setActiveBudget(budget);
    router.back();
  }

  const deleteBudget = async (id) => {
    let budgetsCopy = [...budgets];
    const index = budgetsCopy.findIndex(budget => budget.id === id);
    if (index !== -1) budgetsCopy.splice(index, 1);
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
    // If deleted budget is active, clear activeBudget too
    if (activeBudget && activeBudget.id === id) {
      setActiveBudget(null);
      await storeData('activeBudget', null);
    }
  }

  // Filter out activeBudget from budgets list
  const otherBudgets = budgets ? budgets.filter(b => !activeBudget || b.id !== activeBudget.id) : [];

  return (
    <View style={globalStyles.container}> 
      <ScrollView>
        {/* Active Budget Section */}
        {activeBudget ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.h3, { marginBottom: 10 }]}>{t('general.active_budget') || "Active budget"}</Text>
            <TouchableOpacity onPress={() => updateActiveBudget(activeBudget)}>
              <View style={[globalStyles.transactionContainer, { padding: 10, paddingLeft: 20 }]}>
                <View style={globalStyles.row}>
                  <View style={{ flex: 3 }}>
                    <Text style={globalStyles.h2}>{activeBudget.name ? activeBudget.name : displayDateInFormat(activeBudget.date)}</Text>
                    <View style={globalStyles.row}>
                      <Text style={globalStyles.text}>{t('general.budgeted')}: </Text>
                      <Text style={globalStyles.text}>{showCurrency(currency)}{activeBudget.begginingBalance}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginRight: 'auto' }}>
                    <Text style={globalStyles.text}>{activeBudget.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={globalStyles.hr} />

        {/* Other Budgets Section */}
        {otherBudgets && otherBudgets.length > 0 ? (
          otherBudgets.map(budget => (
            <SwipeableItem key={budget.id} onDelete={() => deleteBudget(budget.id)}>
              <TouchableOpacity onPress={() => updateActiveBudget(budget)}>
                <View style={[globalStyles.transactionContainer, { padding: 10, paddingLeft: 20 }]}>
                  <View style={globalStyles.row}>
                    <View style={{ flex: 3 }}>
                      <Text style={globalStyles.h2}>
                        {budget.name ? budget.name : displayDateInFormat(budget.date)}
                      </Text>
                      <View style={globalStyles.row}>
                        <Text style={globalStyles.text}>{t('general.budgeted')}: </Text>
                        <Text style={globalStyles.text}>
                          {showCurrency(currency)}{budget.begginingBalance}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, marginRight: 'auto' }}>
                      <Text style={globalStyles.text}>{budget.date}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </SwipeableItem>
          ))
        ) : null}
      </ScrollView>
      <TouchableOpacity style={globalStyles.addButton} onPress={() => router.push({ pathname: '/budgetForm' })}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default BudgetsList;
