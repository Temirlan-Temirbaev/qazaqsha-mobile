import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import * as Updates from "expo-updates";
import { useNavigation } from "@react-navigation/core";
import { useRouter } from "expo-router";
import { useCheckAuth } from "../shared/api/auth/check-auth";
import {deleteFromStore} from "@/source/shared/utils/deleteFromStore";
import {receiveFromStore} from "@/source/shared/utils/receiveFromStore";
import {User} from "@/source/core/entities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";

type IAuthContext = {
  user : User | undefined,
  refetch : () => void,
  logout : () => void,
  setToken : (token: string) => void,
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  refetch: () => {},
  logout: () => {},
  setToken: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState("");
  const navigation = useNavigation();
  const router = useRouter();
  const isAuth = !!(
    navigation?.getState()?.routes[0].name === "index" || navigation?.getState()?.routes[0].name === "registration"
  );
  const getToken = async () => {
    const receivedToken = await receiveFromStore("qazaqsha-token");
    console.log("Token received:", receivedToken);
    
    const isCurrentAuthRoute =
      navigation?.getState()?.routes[0].name === "index" || 
      navigation?.getState()?.routes[0].name === "registration";
    
    if (!receivedToken && !isCurrentAuthRoute) {
      logout();
      return;
    }
    
    setToken(receivedToken as string);
  };

  useEffect(() => {
    getToken();
  }, []);

  const logout = async () => {
    setToken("");
    await deleteFromStore("qazaqsha-token");
    if (Platform.OS === "web") {
      window.location.reload();
    } else {
      await Updates.reloadAsync();
    }
    router.push("/");
  };

  const { userData, refetch, isLoading } = useCheckAuth(!isAuth, token);
  
  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  useEffect(() => {
    console.log(userData, isAuth, token);
    console.log(navigation.getState()?.routes[0].name);
    if (userData) {
      if (userData.courses.length === 0) {
        return router.push("/auth/start_test")
      }
      if (!navigation?.getState()?.routes[0].name.includes("/auth")) return router.push("/auth");
    }
    // if (!userData && !token && !isAuth) router.push("/")
  }, [userData, isAuth, token]);

  // if ((isLoading || !userData) && !isAuth) return <Loading />;
  return (
    <AuthContext.Provider value={{ user: userData, refetch, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
