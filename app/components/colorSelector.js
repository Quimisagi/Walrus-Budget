import React from "react";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { getContrastColor, colors } from '../../utils/iconsList';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const ColorSelector = ({ setColor, selectedColor }) => {

  const [iconColor, setIconColor] = useState('black')

  useEffect(() => {
    setIconColor(getContrastColor(selectedColor))
  } , [selectedColor])

  return (
    <View>
      <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
        { colors ? 
            (
              colors.map((color, index) => (
                <TouchableOpacity onPress={() => setColor(color) } key={index}>
                  <View style={[styles.item, selectedColor === color ? styles.selectedItem : null, {backgroundColor: color}]}>
                    { selectedColor === color ? <FontAwesome6 name={"check"} size={22.5} color={iconColor} /> : null}
                  </View>
                </TouchableOpacity>
              ))
            ) : null
        }
      </ScrollView>
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
    backgroundColor: 'gray',
    margin: 5
  },
  selectedItem: {
    borderWidth: 3,
    borderRadius: 30,
    borderColor: 'black',
  }
});

export default ColorSelector;
