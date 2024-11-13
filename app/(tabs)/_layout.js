import { Tabs } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export default () => {
  
  return (
    <Tabs
      screenOptions={{
          showLabel: false,
        }}
    >
      <Tabs.Screen 
      name="home" 
      options={{
        title: '',
        tabBarIcon: (focused) => (
          <FontAwesome6 style={styles.button} name="house" size={24} color={focused ? '#000' : '#89A1A9'} />
        ),
      }}
      />
      <Tabs.Screen
        name="transactionsPlaceholder"
        options={{
          title: '',
          tabBarButton: (focused) => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#00A5E0' : '#FFF',
                borderRadius: 50,
                top: -25,
                width: 65,
                height: 65,
              }}
              onPress={() => {
                router.push({ pathname: '/transactionsForm'});
              }}
            >
              <Ionicons name="add-circle-outline" size={50} color={focused ? '#FFF' : '#000'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen 
        name="accountsList" 
        options={{
          title: '',
          tabBarIcon: (focused) => (
            <FontAwesome6 style={styles.button} name="wallet" size={24} color={focused ? '#000' : '#000'} />
          ),
        }}/>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});

