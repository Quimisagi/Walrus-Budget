import { Stack } from 'expo-router/stack';
import { GlobalProvider } from '../utils/globalProvider';
import globalStyles from '../utils/globalStyles';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message';


Font.loadAsync({
  'PlusJakarta': require('../assets/fonts/PlusJakartaSans.ttf'),
  'Poppins': require('../assets/fonts/Poppins-SemiBold.ttf'),
});


export default function Layout() {
  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: {
            fontFamily: 'Poppins', 
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen 
          name="budgetForm"
          options={{ headerTitle: 'New budget',
          }}
        />
        <Stack.Screen
          name="transactionsForm"
          options={{ headerTitle: 'New transaction' }}
        />
        <Stack.Screen
          name="budgetsList"
          options={{ headerTitle: 'Budgets' }}
        />
        <Stack.Screen
          name="categoryForm"
          options={{ headerTitle: 'New category' }}
        />
        <Stack.Screen
          name="categoryDetails/[id]"
          options={{ headerTitle: '' }}
        />
      </Stack>
      <Toast/>
    </GlobalProvider>
  );
}

