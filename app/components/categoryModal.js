
import React from 'react';
import { useGlobal } from '../../utils/globalProvider';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../../utils/globalStyles';
import Modal from "react-native-modal";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getContrastColor } from "../../utils/iconsList";

const CategoryModal = ({ isVisible, onClose, setCategory }) => {
  const { activeBudgetCategories } = useGlobal();

  // Helper function to chunk array into subarrays of a specific size
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Chunk the categories into rows of 3
  const categoryRows = chunkArray(activeBudgetCategories || [], 3);

  return (
    <View style={globalStyles.centered}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={globalStyles.modal}>
          <View style={globalStyles.centered}>
            <Text style={[globalStyles.h2, { marginBottom: 20 }]}>Select a category</Text>
          </View>
          {categoryRows.map((row, rowIndex) => (
            <View key={rowIndex} style={[globalStyles.row, styles.row]}>
              {row.map((category) => (
                <View key={category.id} style={globalStyles.centered}>
                  <View style={[styles.categoryButton, globalStyles.centered]}>
                    <TouchableOpacity onPress={() => setCategory(category)}>
                      <View style={globalStyles.centered}>
                        {category.icon ? (
                          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                            <FontAwesome6 name={category.icon} size={25} color={getContrastColor(category.color)} />
                          </View>
                        ) : null}
                        {/* Limit text to 10 characters */}
                        <Text style={globalStyles.h3}>
                          {category.name.length > 12 ? `${category.name.slice(0, 10)}...` : category.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 80,
    height: 40,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center', // Center buttons in the row
  },
  backgroundPanel: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CategoryModal;
