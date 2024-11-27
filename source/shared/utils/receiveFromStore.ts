import AsyncStorage from "@react-native-async-storage/async-storage";

export const receiveFromStore = async (itemKey: string) => {
  const token = await AsyncStorage.getItem(itemKey);
  return token;
};
