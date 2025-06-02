import { MMKV } from 'react-native-mmkv';
const mmkv = new MMKV();

export const storeData = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    mmkv.set(key, stringValue);
    console.log(key + ' stored successfully');
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key) => {
  try {
    const value = mmkv.getString(key);
    if (value !== undefined && value !== null) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null; 
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteAllData = async () => {
  try {
    mmkv.clearAll();
    console.log('All data cleared successfully');
  } catch (e) {
    console.log(e);
  }
};
