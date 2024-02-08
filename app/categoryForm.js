import React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import defaultCategories from '../defaultCategories';
import globalStyles from '../src/globalStyles';
import { useGlobal } from './_layout';
import { storeData } from '../src/storage';
import { AntDesign } from '@expo/vector-icons';

const CategoryForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { categoryId, editMode, index} = params;

  const [category, setCategory] = useState({});
  const [amount, setAmount] = useState(0);

  const { activeBudget, setActiveBudget, budgets, setBudgets } = useGlobal();

  const AllocateCategory = async () => {
    console.log("Amount: ", amount);
    const newAllocatedCategory = {
      amount: amount,
      categoryId: categoryId,
    }
    const budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
    if (budgetIndex !== -1) {
      const budgetsTemp = [...budgets];
      budgetsTemp[budgetIndex] = {
          ...budgetsTemp[budgetIndex],
          allocatedCategories: [...budgetsTemp[budgetIndex].allocatedCategories, newAllocatedCategory] 
        };
      await storeData('budgets', JSON.stringify(budgetsTemp));
      setBudgets(budgetsTemp);
      await storeData('activeBudget', JSON.stringify(budgetsTemp[budgetIndex]));
      setActiveBudget(budgetsTemp[budgetIndex]);
    }
    router.back();
  }
  const sendData = async () => {
    if(editMode){
      let allocatedCategoriesTemp = [...activeBudget.allocatedCategories];
      allocatedCategoriesTemp[index].amount = amount;
      let budgetsCopy = [...budgets];
      let budgetIndex = budgets.findIndex(budget => budget.id === activeBudgetId);
      budgetsCopy[budgetIndex].allocatedCategories = allocatedCategoriesTemp;
      await storeData('budgets', JSON.stringify(budgetsCopy));
      setBudgets(budgetsCopy);
      activeBudget.allocatedCategories = allocatedCategoriesTemp;
      router.back();
      return;
    }
    await AllocateCategory();
  }
    const processNumber = (text) => {
    if (text[0] === "$") {
      text = text.slice(1);
    }
    if (isNaN(parseFloat(text))) {
      return 0;
    } else {
      return parseFloat(text);
    }
  };

  useEffect(() => {
    if(editMode){
      let categoryToEdit = activeBudget.allocatedCategories[index];
      setAmount(categoryToEdit.amount);
    }
    let category = defaultCategories.find(category => category.id === categoryId);
    setCategory(category);
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
  }, [navigation, amount]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.h3}>Selected category:</Text>
      <View style={globalStyles.centered}>
        {category.icon ? (
          <View style={[globalStyles.categoryIcon, {backgroundColor: category.color}]}>
            {category.icon}
          </View>
        ) : null
        }
        <Text style={globalStyles.label}>{category.name}</Text>
      </View>
      <View style={[ globalStyles.hr, {margin: 10}]} />
      <Text style={globalStyles.label}>Amount:</Text>
      <TextInput
        style={globalStyles.inputFieldB}
        keyboardType="numeric"
        placeholder="$0.00"
        value={"$" + amount.toString()}
        onChangeText={(text) => setAmount(processNumber(text))}
      />
    </View>
  );
}
export default CategoryForm;

