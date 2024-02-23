import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import defaultCategories from '../../utils/defaultCategories';
import globalStyles from '../../utils/globalStyles';
import { router, navigation } from 'expo-router';
import { useGlobal } from '../../utils/globalProvider';
import { getData, storeData } from "../../utils/storage"; 
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from '../../utils/circularProgress'; 
import { calculatePercentage, calculateCategoryTotalSpent } from '../../utils/numberUtils'

const AllocatedCategoriesList = ({openModal}) => {
  const [categories, setCateogires] = useState([]);
  const { activeBudget, transactions} = useGlobal();

  const goToDetails = (category) => {
    router.push({ pathname: '/allocatedCategoryDetails', params: { id: category.id,  budgetId: activeBudget.id, categoryId: category.categoryId,}});
  }

  const handlePercentage = (percentage) => {
    if (percentage > 100) {
      return 100;
    }
    return percentage;
  }

  useEffect(() => {
    setCateogires([]);
    if(activeBudget.allocatedCategories){
      let categoriesTemp = [];
      activeBudget.allocatedCategories.map(allocatedCategory => {
        const categoryData = defaultCategories.find(category => category.id === allocatedCategory.categoryId);
        const category = Object.assign({}, allocatedCategory, categoryData)
        category.id = allocatedCategory.id;
        const totalSpent = calculateCategoryTotalSpent(category.id, transactions);
        category.totalSpent = totalSpent ? totalSpent : 0;
        category.percentage = calculatePercentage(category.totalSpent, category.amount);
        categoriesTemp = [...categoriesTemp, category];
      }
      );
      setCateogires(categoriesTemp);
    }
  }
    , [activeBudget, transactions, activeBudget.allocatedCategories]);
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
                  onPress={() => goToDetails(category)}
                >
                  {( category.percentage || category.percentage === 0) ? (
                    <View>
                      <CircularProgress
                        percentage={handlePercentage(category.percentage)}
                        color={category.color}
                      >
                        <View>
                          {category.icon}
                        </View>
                      </CircularProgress>
                      {category.percentage > 100 ? (
                        <Text style={styles.warning}>{category.percentage}%</Text>
                      ) : (
                        <Text style={globalStyles.centered}>{category.percentage}%</Text>
                      )}
                    </View>
                  ): (
                    <View>
                      <CircularProgress
                        percentage={100}
                        color={category.color}
                      >
                        <View>
                          {category.icon}
                        </View>
                      </CircularProgress>
                      <Text style={globalStyles.centered}>-</Text>
                    </View>
                  )
                  }
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
  warning: {
    color: 'red',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }

});

export default AllocatedCategoriesList;
