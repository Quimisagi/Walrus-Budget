import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import globalStyles from '../utils/globalStyles';
import { useRouter} from "expo-router";
import { getData, storeData } from "../utils/storage"; 
import { useGlobal } from '../utils/globalProvider';
import { Feather, AntDesign } from '@expo/vector-icons';
import { displayDateInFormat } from '../utils/dateUtils';

const BudgetsList = () => {

  const router = useRouter();

  const { budgets, setBudgets, setActiveBudget} = useGlobal();

  const goToEditBudget = (id) => {
    router.push({pathname: 'budgetForm', params: { editMode: true, id: id } });
  }
  const updateActiveBudget = async (budget) => {
    await storeData('activeBudget', JSON.stringify(budget));
    setActiveBudget(budget);
    router.back();
  }
  const deleteBudget = async (id) => {
    let budgetsCopy = [...budgets];
    let index = budgetsCopy.findIndex(budget => budget.id === id);
    budgetsCopy.splice(index, 1);
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
  }

  return (
    <View style={globalStyles.container}> 
      <ScrollView>
        { budgets ? 
            (
              budgets.map(budget => (
                <TouchableOpacity
                  key={budget.id}
                  onPress={() => {
                    updateActiveBudget(budget);
                  }}
                >
                  <View style={[ globalStyles.transactionContainer, {padding: 10, paddingLeft: 20} ]}>
                    <View style={globalStyles.row}>
                      <View style={{flex: 3}}>
                        <Text style={globalStyles.h2}>{ budget.name ? budget.name : displayDateInFormat(budget.date)}</Text>
                        <View style={globalStyles.row}>
                          <Text style={globalStyles.text}>Budgeted: </Text>
                          <Text style={globalStyles.text}>${budget.begginingBalance}</Text>
                        </View>
                      </View>
                      <View style={[ {flex: 1, marginRight: 'auto'}]}>
                        <Text style={globalStyles.text}>{budget.date}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : 
            (
              <Text>No budgets</Text>
            ) 
        }
      </ScrollView>
      <TouchableOpacity style={globalStyles.addButton} onPress={() => router.push({ pathname: '/budgetForm'})}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

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
