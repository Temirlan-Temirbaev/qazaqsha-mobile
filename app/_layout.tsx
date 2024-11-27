import {Stack} from "expo-router";
import QueryProvider from "@/source/app/QueryProvider";
import {AuthProvider} from "@/source/app/AuthProvider";

export default function Layout() {
  return <QueryProvider>
    <AuthProvider>

      <Stack screenOptions={{headerShown: false}}/>
    </AuthProvider>

  </QueryProvider>
}