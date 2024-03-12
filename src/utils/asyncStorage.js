import AsyncStorage from '@react-native-async-storage/async-storage';

// Stores given key/value pair in Async Storage
const storeData = async (key, value) => {
  try {
    value = JSON.stringify(value);
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    throw new Error(error || 'Error saving data');
  }
};

// Retrieves value for a given key from Async storage
const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    throw new Error(error || 'Error retrieving data');
  }
};

export { retrieveData, storeData };
