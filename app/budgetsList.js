import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import globalStyles from '../src/globalStyles';
import { useRouter} from "expo-router";
import { getData, storeData } from "../src/storage"; 
import { useGlobal } from './_layout';

const BudgetsList = () => {

  const router = useRouter();

  const { budgets, setBudgets, setActiveBudget} = useGlobal();

  const goToEditBudget = (id) => {
    router.push({pathname: 'budgetForm', params: { editMode: true, id: id } });
  }
  const updateActiveBudget = async (budget) => {
    await storeData('activeBudget', JSON.stringify(budget));
    setActiveBudget(budget);
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
      <Text>Budgets List</Text>
      <ScrollView>
        { budgets ? 
            (
              budgets.map(budget => (
                <View style={globalStyles.row} key={budget.id}>
                  <TouchableOpacity
                    style={globalStyles.column}
                    onPress={() => {
                      updateActiveBudget(budget);
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
        <TouchableOpacity style={globalStyles.button} onPress={()=> router.back()}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },
});

export default BudgetsList;
