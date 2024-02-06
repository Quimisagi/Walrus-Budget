import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import defaultCategories from '../defaultCategories';
import globalStyles from '../src/globalStyles';
import Modal from "react-native-modal";

const CategoryModal = ({ isVisible, onClose, setCategory, categories, filterSelected = false }) =>{
  const [filteredCategories, setFilteredCategories] = useState([]);

  const selectedCategories = () => {
    const filteredCategories = categories.map(allocatedCategory => {
      const matchedCategory = defaultCategories.find(defaultCategory => defaultCategory.id === allocatedCategory.categoryId);
      return {...matchedCategory, ...allocatedCategory} 
    });
    return filteredCategories;
  }
  const notSelectedCategories = () => {
    const notSelected = defaultCategories.filter(defaultCategory => {
      // Check if the category id is not present in the selected categories
      return !categories.some(allocatedCategory => allocatedCategory.categoryId === defaultCategory.id);
    });
    return notSelected;
  };

  useEffect(() => {
    if (categories) { 
      filterSelected ? setFilteredCategories(selectedCategories()) : setFilteredCategories(notSelectedCategories()); 
    }
    else {
      setFilteredCategories(defaultCategories);
    }
  } , [categories]);

  return(
    <View style={globalStyles.centered}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={globalStyles.modal}>
          <Text style={[ globalStyles.label, {marginBottom: 20} ]}>Select a category:</Text>
          <View style={globalStyles.hr} />
          {filteredCategories !== undefined ? (
            filteredCategories.map((category, index) => (
              <View key={index}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={{width: '100%'}} onPress={() => setCategory(category)}> 
                    <View style={globalStyles.row}>
                      {category.icon ? (
                        <View style={[globalStyles.categoryIcon, {backgroundColor: category.color}]}>
                          {category.icon}
                        </View>
                      ) : null
                      }
                      <Text>{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={globalStyles.hr} />
              </View>
            ))
          ) : null}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 5,
  },
  backgroundPanel:{
    flex: 1,
    backgroundColor: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export default CategoryModal;
