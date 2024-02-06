import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default () => {
  
  return (
    <Tabs>
      <Tabs.Screen name="home" href="home" />
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
      <Tabs.Screen name="settings" href="settings"/>
    </Tabs>
  );
}
