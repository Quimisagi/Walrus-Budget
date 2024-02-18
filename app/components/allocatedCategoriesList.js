import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import defaultCategories from '../../utils/defaultCategories';
import globalStyles from '../../utils/globalStyles';
import { router } from 'expo-router';
import { useGlobal } from '../../utils/globalProvider';
import { getData, storeData } from "../../utils/storage"; 
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from '../../utils/circularProgress'; 
import { calculatePercentage } from '../../utils/numberUtils'

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
    console.log(allocatedCategories);
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
    <View style={styles.categoriesContainer}>
      <View> 
        <Text style={globalStyles.h2} >Categories</Text>
        <View>
          <ScrollView horizontal={true}>
            <TouchableOpacity onPress={openModal}>
              <View style={styles.categoryContainer}>
                <View style={styles.dottedCategoryContainer}>
                  <Ionicons name="add-sharp" size={40} color={'#bcc1ca'}/>
                </View>
                <Text style={globalStyles.centered}>Add</Text>
              </View>
            </TouchableOpacity>
            { categories ? (
              categories.map((category, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => goToDetails(category.categoryId)}
                >
                  <CircularProgress
                    percentage={35}
                    color={category.color}
                  >
                  <View>
                    {category.icon}
                  </View>
                  </CircularProgress>
                  <Text style={globalStyles.centered}>100%</Text>
                </TouchableOpacity>
              ))) : (<Text>No allocated categories</Text>)
            }
          </ScrollView>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    padding: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 10
  },
  dottedCategoryContainer:{
    width: 60,
    height: 60,
    borderRadius: 30, 
    borderWidth: 3,
    borderColor: '#bcc1ca',
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
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
