import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../utils/globalProvider';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../../utils/globalStyles';
import Modal from "react-native-modal";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getContrastColor } from "../../utils/iconsList";

const CategoryModal = ({ isVisible, onClose, setCategory}) =>{

  const { activeBudgetCategories } = useGlobal();

  return(
    <View style={globalStyles.centered}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={globalStyles.modal}>
          <Text style={[ globalStyles.label, {marginBottom: 20} ]}>Select a category:</Text>
          {activeBudgetCategories ? (
            <View style={globalStyles.row}>
              {activeBudgetCategories.map((category) => (
                <View key={category.id}>
                  <View style={styles.categoryButton}>
                    <TouchableOpacity onPress={() => setCategory(category)}> 
                      <View>
                        {category.icon ? (
                          <View style={[globalStyles.categoryIcon, {backgroundColor: category.color}]}>
                            <FontAwesome6 name={category.icon} size={25} color={getContrastColor(category.color)} />
                          </View>
                        ) : null
                        }
                        <Text>{category.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={globalStyles.hr} />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 10,
  },
  backgroundPanel:{
    flex: 1,
    backgroundColor: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export default CategoryModal;
