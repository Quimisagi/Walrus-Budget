import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({headerShown: false });
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={styles.noBudgetsPanel}>
        <View style={styles.message}>
        <Text style={globalStyles.h2}>Welcome!</Text>
          <Text style={globalStyles.p}>Start creating your first budget</Text>
          <TouchableOpacity
            style={[globalStyles.row, styles.addNewBudget]}
            onPress={() => router.push({ pathname: '/budgetForm'})}
          >
            <View style={{flex: 4}}>
            </View>
            <View style={{flex: 2}}>
              <Ionicons name="add-circle-outline" size={30} color={'#00A5E0'} />
            </View>
            <View style={{flex: 6}}>
              <Text style={[globalStyles.h3, styles.addNewBudgetText]}>Add new budget</Text>
            </View>
            <View style={{flex: 4}}>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.walrus}>
          <Image source={require('../assets/walrus2.png')} style={{ width: 300, height: 300 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noBudgetsPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walrus: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes content to the bottom
  },
  addNewBudget: {
    backgroundColor: '#D6F4FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    height: 50,
  },
  addNewBudgetText: {
    marginTop: 2,
    color: '#00A5E0',
  },
});

export default WelcomeScreen;
