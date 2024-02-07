import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export default () => {
  
  return (
    <Tabs>
      <Tabs.Screen 
      name="home" 
      options={{
        title: 'Home',
        tabBarIcon: (focused) => (
          <Entypo name="home" size={24} color={focused ? '#000' : '#000'} />
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
                borderRadius: 10,
                top: -20,
                width: 60,
                height: 60,
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
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: (focused) => (
            <Ionicons name="settings" size={24} color={focused ? '#000' : '#000'} />
          ),
        }}/>
    </Tabs>
  );
}
