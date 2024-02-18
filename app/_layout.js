import { Stack } from 'expo-router/stack';
import { GlobalProvider } from '../utils/globalProvider';

export default function Layout() {
  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#AED1D6',
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
          name="allocatedCategoryDetails"
          options={{ headerTitle: 'Category details' }}
        />
      </Stack>
    </GlobalProvider>
  );
}

