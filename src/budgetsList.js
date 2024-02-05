import React from 'react';
import { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, TextInput, Button, Pressable, ScrollView } from "react-native";
import globalStyles from '../src/globalStyles';

import { getData, storeData } from "./storage"; 
import { useGlobal } from '../app/_layout';
import { router } from 'expo-router';

const BudgetsList = ({isVisible, onClose, onSetActiveBudgetId}) => {

  const { budgets, setBudgets} = useGlobal();

  const goToEditBudget = (id) => {
    router.push({pathname: 'budgetForm', params: { editMode: true, id: id } });
    onClose();
  }

  const deleteBudget = async (id) => {
    let budgetsCopy = [...budgets];
    let index = budgetsCopy.findIndex(budget => budget.id === id);
    budgetsCopy.splice(index, 1);
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
  }


  return (
    <View> 
      <Modal
        animationType="slide"
        visible={isVisible}
        onRequestClose={onClose}
        style={styles.modal}
      >
        <Text>Budgets List</Text>
        <ScrollView>
          { budgets ? 
              (
                budgets.map(budget => (
                  <View style={globalStyles.row} key={budget.id}>
                    <TouchableOpacity
                      style={globalStyles.column}
                      onPress={() => {
                        onSetActiveBudgetId(budget);
                        onClose();
                      }}
                    >
                      <Text>{budget.date}</Text>
                      <Text>{budget.name}</Text>
                    </TouchableOpacity>
                    <View style={globalStyles.column}>
                      <TouchableOpacity onPress={() => goToEditBudget(budget.id)}>
                        <View style={[styles.button, { backgroundColor: '#000' }]} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteBudget(budget.id)}>
                        <View style={[styles.button, { backgroundColor: '#E31' }]} />
                      </TouchableOpacity>

                    </View>
                  </View>
                ))
              ) : 
              (
                <Text>No budgets</Text>
              ) 
          }
        </ScrollView>
        <View>
          <TouchableOpacity style={globalStyles.button} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default BudgetsList;
