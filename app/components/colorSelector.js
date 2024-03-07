import React from "react";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { getContrastColor, colors } from '../../utils/iconsList';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const ColorSelector = ({ setSelectedItem }) => {

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [iconColor, setIconColor] = useState('black')

  useEffect(() => {
    setIconColor(getContrastColor(colors[selectedIndex]))
  } , [selectedIndex])

  return (
    <View>
      <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
        { colors ? 
            (
              colors.map((color, index) => (
                <TouchableOpacity onPress={() => { setSelectedIndex(index); setSelectedItem(color) }} key={index}>
                  <View style={[styles.item, index === selectedIndex ? styles.selectedItem : null, {backgroundColor: color}]}>
                    { index === selectedIndex ? <FontAwesome6 name={"check"} size={22.5} color={iconColor} /> : null}
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
