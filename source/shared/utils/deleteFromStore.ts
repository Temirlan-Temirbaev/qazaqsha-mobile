import AsyncStorage from "@react-native-async-storage/async-storage";
import { receiveFromStore } from "./receiveFromStore";

export const deleteFromStore = async (key) => {
  await AsyncStorage.removeItem(key);
  const token = await receiveFromStore("uapp-token");
};
