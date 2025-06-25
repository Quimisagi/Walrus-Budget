
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../utils/globalStyles';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useGlobal } from '../../utils/globalProvider';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from '../../utils/circularProgress';
import { calculatePercentage, calculateCategoryTotalSpent } from '../../utils/numberUtils';

const categoriesList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const { 
    activeBudget,
    activeBudgetCategories,
    activeBudgetTransactions,
  } = useGlobal();

  const goToDetails = (category) => {
    router.push({ pathname: 'categoryDetails/' + category.id });
  };

  const goToAddCategory = () => {
    router.push({ pathname: '/categoryForm', params: { budgetId: activeBudget.id } });
  };

  const handlePercentage = (percentage) => (percentage > 100 ? 100 : percentage);

  useEffect(() => {
    if (activeBudgetCategories) {
      const categoriesTemp = activeBudgetCategories.map(category => {
        const spent = calculateCategoryTotalSpent(category.id, activeBudgetTransactions);
        const percentage = calculatePercentage(spent, category.amount);
        return {
          ...category,
          spent,
          percentage
        };
      });
      setCategories(categoriesTemp);
    }
  }, [activeBudgetCategories, activeBudgetTransactions]);

  return (
    <View style={styles.categoriesContainer}>
      <View> 
        <Text style={globalStyles.h2}>Categories</Text>
        <View style={globalStyles.block}>
          <ScrollView horizontal={true}>
            <TouchableOpacity onPress={goToAddCategory}>
              <View style={styles.categoryContainer}>
                <View style={styles.dottedCategoryContainer}>
                  <Ionicons name="add-sharp" size={40} color={'#bcc1ca'} />
                </View>
                <View style={styles.addCategory}>
                  <Text style={[globalStyles.centered, globalStyles.h3]}>Add</Text>
                </View>
              </View>
            </TouchableOpacity>
            {categories ? (
              categories.map((category, index) => (
                <TouchableOpacity key={index} onPress={() => goToDetails(category)}>
                  {category.amount > 0 ? (
                    <View>
                      <CircularProgress
                        percentage={handlePercentage(category.percentage)}
                        color={category.color}
                        icon={category.icon}
                      />
                      {category.percentage < 10 ? (
                        <Text style={[styles.warning, globalStyles.h3]}>{category.percentage}%</Text>
                      ) : (
                        <View>
                          <Text style={[globalStyles.centered, globalStyles.h3]}>{category.percentage}%</Text>
                          <Text style={[globalStyles.centered, globalStyles.secondaryText]}>
                            {category.name.length > 12 ? `${category.name.slice(0, 10)}...` : category.name}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      <CircularProgress
                        percentage={100}
                        color={category.color}
                        icon={category.icon}
                      />
                      <Text style={globalStyles.centered}>-</Text>
                      <Text style={[globalStyles.centered, globalStyles.secondaryText]}>
                        {category.name.length > 10 ? `${category.name.slice(0, 10)}...` : category.name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text>No allocated categories</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    padding: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  dottedCategoryContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#bcc1ca',
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    color: 'red',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategory: {
    marginTop: 10,
  },
});

export default categoriesList;
