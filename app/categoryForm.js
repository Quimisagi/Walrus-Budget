import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import defaultCategories from '../utils/defaultCategories';
import globalStyles from '../utils/globalStyles';
import { useGlobal } from '../utils/globalProvider';
import { storeData } from '../utils/storage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { processMoneyValue } from '../utils/numberUtils';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getContrastColor, colors } from '../utils/iconsList';  
import ColorSelector from './components/colorSelector';
import IconsModal from './components/iconsModal';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const CategoryForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { categoryId, editMode, index} = params;

  const [category, setCategory] = useState({});
  const [name, setName] = useState('');
  const [color, setColor] = useState('#81ecec');
  const [icon, setIcon] = useState('');
  const [amount, setAmount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  const { activeBudget, setActiveBudget, budgets, setBudgets } = useGlobal();
  const budgetRef = useRef(null);

  const [iconColor, setIconColor] = useState('black');

  const AllocateCategory = async () => {
    const newAllocatedCategory = {
      id     : uuidv4(),
      amount : amount,
      name   : name,
      icon   : icon
    }
    const budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
    if (budgetIndex !== -1) {
      const budgetsTemp = [...budgets];
      budgetsTemp[budgetIndex] = {
        ...budgetsTemp[budgetIndex],
        allocatedCategories: [...budgetsTemp[budgetIndex].allocatedCategories, newAllocatedCategory] 
      };
      await storeData('budgets', JSON.stringify(budgetsTemp));
      setBudgets(budgetsTemp);
      await storeData('activeBudget', JSON.stringify(budgetsTemp[budgetIndex]));
      setActiveBudget(budgetsTemp[budgetIndex]);
    }
    router.back();
  }
  const sendData = async () => {
    if(editMode){
      let allocatedCategoriesTemp = [...activeBudget.allocatedCategories];
      allocatedCategoriesTemp[index].amount = amount;
      let budgetsCopy = [...budgets];
      let budgetIndex = budgets.findIndex(budget => budget.id === activeBudget.id);
      budgetsCopy[budgetIndex].allocatedCategories = allocatedCategoriesTemp;
      await storeData('budgets', JSON.stringify(budgetsCopy));
      setBudgets(budgetsCopy);
      activeBudget.allocatedCategories = allocatedCategoriesTemp;
      router.back();
      return;
    }
    await AllocateCategory();
  }

  const focusBudget = () => {
    if(budgetRef.current){
      budgetRef.current.focus();
    }
  }

  useEffect(() => {
    if(editMode){
      let categoryToEdit = activeBudget.allocatedCategories[index];
      setAmount(categoryToEdit.amount);
    }
    let category = defaultCategories.find(category => category.id === parseInt( categoryId ));
    setCategory(category);
  }
    , []);

  useEffect(() => {
    const iconColor = getContrastColor(color);
    setIconColor(iconColor);
  }, [color]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={sendData}
        >
          <AntDesign name="check" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, amount]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Budgeted value:</Text>
      <TouchableOpacity onPress={focusBudget}>
        <Text style={globalStyles.inputFieldB}>{'$' + amount.toString()}</Text>
      </TouchableOpacity>
      <TextInput
        style={globalStyles.inputFieldBInvisible}
        ref={budgetRef}
        autoFocus={true}
        keyboardType="numeric"
        value={"$" + amount.toString()}
        onChangeText={(text) => setAmount(processMoneyValue(text))}
      />
      <View style={globalStyles.hr}/>
      <View style={[ globalStyles.row, {marginBottom: 15, marginTop: 5, justifyContent: 'center'} ]}>
        <View style={[{flex: 1} ]}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={[globalStyles.categoryIcon, {backgroundColor: color}]}>
            {icon ? (
              <FontAwesome6 name={icon} size={30} color={iconColor} />
            ) : (
              <Text style={[globalStyles.text, {color: iconColor}]}>Icon</Text>
            )
            }
          </TouchableOpacity>
        </View>
        <View style={{flex: 3, justifyContent:'center'}}>
          <View style={[ globalStyles.inputFieldContainer, globalStyles.row]}> 
            <View style={[ globalStyles.centered, {flex:1} ]}>
              <MaterialCommunityIcons name="text" size={16} color="black" />
            </View>
            <TextInput
              style={[ globalStyles.inputField, {flex: 9}]}
              placeholder='Name'
              value={name}
              onChangeText={(text) => { setName(text); }}
            />
          </View>
        </View>
      </View>
      <Text style={globalStyles.label}>Color:</Text>
      <ColorSelector items={colors} areItemsColors={true} setSelectedItem={(color) => setColor(color)}/>
      <IconsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        setIcon={(icon) => setIcon(icon)}
        selectedIcon={icon}
      />
    </View>
  );
}

export default CategoryForm;

