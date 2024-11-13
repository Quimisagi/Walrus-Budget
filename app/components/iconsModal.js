import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import defaultCategories from '../../utils/defaultCategories';
import globalStyles from '../../utils/globalStyles';
import Modal from "react-native-modal";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { icons } from '../../utils/iconsList';

const IconsModal = ({ isVisible, onClose, setIcon, selectedIcon}) =>{

  return(
    <View style={globalStyles.centered}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={[globalStyles.modal, globalStyles.centered]}>
          <Text style={[ globalStyles.h2, {marginBottom: 20} ]}>Select icon</Text>
          <View style={[globalStyles.row, globalStyles.centered]}>
            {icons.map((icon, index) => (
              <View key={index}>
                <TouchableOpacity style={[styles.item, selectedIcon === icon ? styles.selectedItem : null]} onPress={() => { setIcon(icon); onClose(); }}>
                <FontAwesome6 name={icon} size={22.5} color="black" />
              </TouchableOpacity>
              </View>
            ))}
          </View>

        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  item:{
    width: 40,
    height: 40,
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C2C9C8',
    margin: 5
  },
  selectedItem: {
    borderWidth: 3,
    borderRadius: 30,
    borderColor: 'red',
  }
});

export default IconsModal;
