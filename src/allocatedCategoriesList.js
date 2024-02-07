import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import defaultCategories from '../defaultCategories';
import globalStyles from './globalStyles';
import { router } from 'expo-router';
import { useGlobal } from '../app/_layout';
import { getData, storeData } from "./storage"; 
import { Ionicons } from '@expo/vector-icons';

const AllocatedCategoriesList = ({allocatedCategories, openModal}) => {
  const [categories, setCateogires] = useState([]);
  const { activeBudget, budgets, setBudgets } = useGlobal();

  const goToDetails = (categoryId) => {
    router.push({ pathname: '/allocatedCategoryDetails', params: { budgetId: activeBudget.id, categoryId: categoryId,}});
  }
  const goToEdit = (index, categoryId) => {
    console.log(index);
    router.push({ pathname: '/addCategory', params: { categoryId: categoryId, editMode: true, index: index} });
  }

  const deleteCategory = async (index) => {
    let allocatedCategoriesTemp = [...activeBudget.allocatedCategories];
    allocatedCategoriesTemp.splice(index, 1);
    let budgetsCopy = [...budgets];
    let budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
    budgetsCopy[budgetIndex].allocatedCategories = allocatedCategoriesTemp;
    await storeData('budgets', JSON.stringify(budgetsCopy));
    setBudgets(budgetsCopy);
    activeBudget.allocatedCategories = allocatedCategoriesTemp;
  }
  useEffect(() => {
    setCateogires([]);
    if(allocatedCategories){
      let categoriesTemp = [];
      allocatedCategories.map(allocatedCategory => {
        const categoryData = defaultCategories.find(category => category.id === allocatedCategory.categoryId);
        const category = Object.assign({}, allocatedCategory, categoryData)
        categoriesTemp = [...categoriesTemp, category];
      }
      );
      setCateogires(categoriesTemp);
    }
  }
    , [allocatedCategories]);
  return (
    <View>
      <View>
        <TouchableOpacity style={globalStyles.buttonA} onPress={openModal}>
          <View style={globalStyles.row}>
            <Ionicons style={globalStyles.buttonAText} name="add-circle-outline" size={12}/>
            <Text style={globalStyles.buttonAText}>Add category</Text>
          </View>
        </TouchableOpacity>
      </View>
      { categories ? (
        categories.map((category, index) => (
          <View style={styles.categoryContainer} key={index}>
            <TouchableOpacity style={globalStyles.row} onPress={() => goToDetails(category.id)}>
              <View style={globalStyles.column}>
                <View style={globalStyles.row}>
                  {category.icon ? (
                    <View style={[globalStyles.categoryIcon, {backgroundColor: category.color}]}>
                      {category.icon}
                    </View>
                  ) : null
                  }
                  <Text style={globalStyles.h3}>{category.name}</Text>
                </View>
              </View>
              <View style={styles.column}>
                <Text>{category.amount}</Text>
                <TouchableOpacity onPress={() => goToEdit(index, category.id)}>
                  <View style={[styles.button, { backgroundColor: '#000' }]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCategory(index)}>
                  <View style={[styles.button, { backgroundColor: '#E31' }]} />
                </TouchableOpacity>

              </View>
              <View style={globalStyles.hr}/>
            </TouchableOpacity>
          </View>
        ))) : (<Text>No allocated categories</Text>)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    padding: 10,
    backgroundColor: '#EAEAEA',
  },
  categoryName: {
    flex: 1,
  },
  categoryAmount: {
    flex: 1,
  },
  button: {
    width: 30,
    height: 30, 
    borderRadius: 8,
  },

});

export default AllocatedCategoriesList;
