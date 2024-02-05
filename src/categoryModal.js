import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import defaultCategories from '../defaultCategories';
import globalStyles from '../src/globalStyles';




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
    <View>
      <Modal
        animationType="slide"
        visible={isVisible}
        onRequestClose={() => {
          onClose();
        }}
      >
        <View>
          {filteredCategories !== undefined ? (
            filteredCategories.map((category, index) => (
              <View style={globalStyles.row} key={index}>
                <TouchableOpacity style={styles.categoryButton} onPress={() => setCategory(category)}> 
                  <View style={globalStyles.row}>
                    {category.icon ? (
                      category.icon) : null
                    }
                    <Text>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : null}

        </View>
        <View>
          <TouchableOpacity style={globalStyles.button} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
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
  
});

export default CategoryModal;
