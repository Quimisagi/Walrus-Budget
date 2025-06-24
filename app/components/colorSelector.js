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
    <ScrollView horizontal>
      <View style={{ flexDirection: 'column' }}>
        {/* First Row */}
        <View style={{ flexDirection: 'row' }}>
          {colors &&
            colors
              .filter((_, i) => i % 2 === 0)
              .map((color, index) => (
                <TouchableOpacity onPress={() => setColor(color)} key={`top-${index}`}>
                  <View
                    style={[
                      styles.item,
                      selectedColor === color ? styles.selectedItem : null,
                      { backgroundColor: color },
                    ]}
                  >
                    {selectedColor === color && (
                      <FontAwesome6 name="check" size={22.5} color={iconColor} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
        </View>

        {/* Second Row */}
        <View style={{ flexDirection: 'row' }}>
          {colors &&
            colors
              .filter((_, i) => i % 2 !== 0)
              .map((color, index) => (
                <TouchableOpacity onPress={() => setColor(color)} key={`bottom-${index}`}>
                  <View
                    style={[
                      styles.item,
                      selectedColor === color ? styles.selectedItem : null,
                      { backgroundColor: color },
                    ]}
                  >
                    {selectedColor === color && (
                      <FontAwesome6 name="check" size={22.5} color={iconColor} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </View>
    </ScrollView>
  </View>
);
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
