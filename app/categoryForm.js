import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { storeData } from '../utils/storage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { processMoneyValue, formatMoney } from '../utils/numberUtils';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import { getContrastColor, colors } from '../utils/iconsList';  
import ColorSelector from './components/colorSelector';
import IconsModal from './components/iconsModal';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message';
import { showCurrency } from '../utils/currency';

const CategoryForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { id, editMode } = params;

  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [icon, setIcon] = useState('star');
  const [amount, setAmount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  const { activeBudget, categories, setCategories, currency } = useGlobal();
  const budgetRef = useRef(null);

  const [iconColor, setIconColor] = useState('black');

  const createCategory = async (newCategory) => {
    try {
      const categoriesTemp = [...categories];
      categoriesTemp.push(newCategory);
      await storeData('categories', JSON.stringify(categoriesTemp));
      setCategories(categoriesTemp);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Category created',
      });

    } catch (error) {
      console.error("Error creating category: ", error)
    }
    router.back();
  };

  const updateCategory = async (category) => {
    try {
      const categoriesTemp = [...categories];
      const index = categoriesTemp.findIndex(cat => cat.id === category.id);
      categoriesTemp[index] = category;
      await storeData('categories', JSON.stringify(categoriesTemp));
      setCategories(categoriesTemp);
    } catch (error) {
      console.error("Error updating category: ", error)
    }
    router.back();
  };

  const sendData = async () => {
    const newCategory = {
      id       : uuid.v4(),
      budgetId : activeBudget.id,
      amount   : amount,
      name     : name,
      icon     : icon,
      color    : color,
    };

    if(editMode){
      newCategory.id = id;
      await updateCategory(newCategory);
      return;
    }
    await createCategory(newCategory);
  };

  const focusBudget = () => {
    if(budgetRef.current){
      budgetRef.current.focus();
    }
  };

  useEffect(() => {
    if(editMode){
      const category = categories.find(category => category.id === id);
      if(category === undefined) return;
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
      setAmount(category.amount);
    }
  }, [editMode]);

  useEffect(() => {
    const iconColor = getContrastColor(color);
    setIconColor(iconColor);
  }, [color]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: editMode ? 'Edit category' : 'New category',
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={sendData}
        >
          <AntDesign name="check" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, amount, icon, color, name]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Budgeted value:</Text>
      <TouchableOpacity onPress={focusBudget}>
        <Text style={globalStyles.inputFieldB}>{showCurrency(currency) + formatMoney(amount.toLocaleString())}</Text>
      </TouchableOpacity>
      <TextInput
        style={globalStyles.inputFieldBInvisible}
        ref={budgetRef}
        autoFocus={true}
        keyboardType="numeric"
        maxLength={18}
        value={"$" + amount.toString()}
        onChangeText={(text) => setAmount(processMoneyValue(text))}
      />
      <View style={[ globalStyles.row, {marginBottom: 15, marginTop: 25, justifyContent: 'center'} ]}>
        <View style={[{flex: 1}]}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={[globalStyles.categoryIcon, styles.categoryButton, {backgroundColor: color}]}>
            {icon ? (
              <FontAwesome6 name={icon} size={30} color={iconColor} />
            ) : (
              <Text style={[globalStyles.text, {color: iconColor}]}>Icon</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{flex: 3, justifyContent:'center'}}>
          <View style={[ globalStyles.inputFieldContainer, globalStyles.row, styles.name ]}> 
            <View style={[ globalStyles.centered, {flex:1} ]}>
              <MaterialCommunityIcons name="text" size={16} color="black" />
            </View>
            <TextInput
              style={[ globalStyles.inputField, {flex: 9}]}
              placeholder='Category name'
              value={name}
              maxLength={24}
              onChangeText={(text) => { setName(text); }}
            />
          </View>
        </View>
      </View>
      <Text style={globalStyles.label}>Pick a color:</Text>
      <ColorSelector setColor={(color) => setColor(color)} selectedColor={color} />
      <IconsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        setIcon={(icon) => setIcon(icon)}
        selectedIcon={icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    height: 60,
    width: 60,
  },
  name: {
    marginTop: 7.5,
  },
});

export default CategoryForm;

