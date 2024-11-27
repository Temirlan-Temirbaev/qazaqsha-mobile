import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStore = async (itemKey: string, itemValue: string) => {
  await AsyncStorage.setItem(itemKey, itemValue);
  const token = await AsyncStorage.getItem(itemKey);
  return token;
};
