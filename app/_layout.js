import { Stack } from 'expo-router/stack';
import { GlobalProvider } from '../utils/globalProvider';
import './i18n'; // Import i18n configuration
import globalStyles from '../utils/globalStyles';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next'; // Import useTranslation


Font.loadAsync({
  'PlusJakarta': require('../assets/fonts/PlusJakartaSans.ttf'),
  'Poppins': require('../assets/fonts/Poppins-SemiBold.ttf'),
});


export default function Layout() {
  const { t } = useTranslation(); // Initialize t function

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
          options={{ headerTitle: t('screens.newBudget') }}
        />
        <Stack.Screen
          name="transactionsForm"
          options={{ headerTitle: t('screens.newTransaction') }}
        />
        <Stack.Screen
          name="budgetsList"
          options={{ headerTitle: t('screens.budgets') }}
        />
        <Stack.Screen
          name="categoryForm"
          options={{ headerTitle: t('screens.newCategory') }}
        />
        <Stack.Screen
          name="categoryDetails/[id]"
          options={{ headerTitle: '' }} // Assuming no title or dynamic title handled differently
        />
        <Stack.Screen
          name="accountForm"
          options={{ headerTitle: t('screens.newAccount') }}
        />

      </Stack>
      <Toast/>
    </GlobalProvider>
  );
}

