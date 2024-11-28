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
    navigation?.getState()?.routes[0].name === "index" || "registration"
  );
  const getToken = async () => {
    const receivedToken = await receiveFromStore("qazaqsha-token");
    setToken(receivedToken as string);
  };

  useEffect(() => {
    getToken();
  }, []);

  const logout = async () => {
    setToken("");
    await deleteFromStore("qazaqsha-token");
    await Updates.reloadAsync();
    router.push("/");
  };

  const { userData, refetch, isLoading } = useCheckAuth(!isAuth, token);
  useEffect(() => {
    if (token) refetch();
  }, [token]);
  useEffect(() => {
    if (userData && isAuth) {
      if (userData.courses.length === 0) {
        return router.push("/auth/start_test")
      }
      router.push("/auth");
    }
  }, [userData, isAuth, token]);

  // if ((isLoading || !userData) && !isAuth) return <Loading />;
  return (
    <AuthContext.Provider value={{ user: userData, refetch, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
