import React from "react";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HorizontalScrolleableSelector = ({ items, areItemsColors = false, setSelectedItem }) => {

  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <View>
      <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
        { items ? 
            (
              items.map((item, index) => (
                <TouchableOpacity onPress={() => { setSelectedIndex(index); setSelectedItem(item) }} key={index}>
                  {areItemsColors ? (
                    <View style={[styles.item, index === selectedIndex ? styles.selectedItem : null, {backgroundColor: item}]}>
                      <View>
                      </View>
                    </View>
                  ) : (
                    <View style={[ styles.item, index === selectedIndex ? styles.selectedItem : null ]}>
                      {item}
                    </View>
                  )}
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
    borderColor: 'gray',
  }
});

export default HorizontalScrolleableSelector;
