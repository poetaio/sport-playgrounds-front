import AsyncStorage from '@react-native-async-storage/async-storage';

export const customStorage = {
  getLocation: async () => await AsyncStorage.getItem('location').then(location => JSON.parse(location)),
  setLocation: async (location) => await AsyncStorage.setItem('location', JSON.stringify(location)),
};
