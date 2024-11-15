import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

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
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              style={styles.button}
              name="house"
              size={24}
              color={focused ? '#333333' : '#89A1A9'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactionsPlaceholder"
        options={{
          title: '',
          tabBarButton: ({ focused }) => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: -25,
                width: 65,
                height: 65,
              }}
              onPress={() => {
                router.push({ pathname: '/transactionsForm' });
              }}
            >
              <LinearGradient
                colors={['#A9D8EF', '#00A5E0']} // Gradient colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  width: 65,
                  height: 65,
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={50}
                  color={focused ? '#FFF' : '#000'}
                />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen 
        name="accountsList" 
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              style={styles.button}
              name="wallet"
              size={24}
              color={focused ? '#333333' : '#89A1A9'}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});
