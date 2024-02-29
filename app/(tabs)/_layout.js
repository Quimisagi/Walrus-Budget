import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
          <Entypo style={styles.button} name="home" size={24} color={focused ? '#000' : '#000'} />
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
                backgroundColor: focused ? '#000' : '#FFF',
                borderRadius: 30,
                top: -15,
                width: 50,
                height: 50,
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
          title: 'Accounts',
          tabBarIcon: (focused) => (
            <Ionicons style={styles.button} name="settings" size={24} color={focused ? '#000' : '#000'} />
          ),
        }}/>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

