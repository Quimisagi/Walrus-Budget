import { Tabs } from 'expo-router';

export default () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" href="home" />
      <Tabs.Screen name="settings" href="settings"/>
    </Tabs>
  );
}
