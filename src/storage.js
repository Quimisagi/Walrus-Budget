import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(key + ' stored successfully');
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value; // Return the value directly
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteAllData = async () => {
  AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));
}
