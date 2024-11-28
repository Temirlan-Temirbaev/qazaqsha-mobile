import { Pressable, ScrollView, Text} from 'react-native';
import React, {useContext} from "react";
import {AuthContext} from "@/source/app/AuthProvider";


export default function HomeScreen() {
  const {user, logout} = useContext(AuthContext)
  if (!user) return;
  return (
    <ScrollView>
      <Text>{user.username}</Text>
      <Pressable onPress={() => logout()}><Text>Выйти</Text></Pressable>
    </ScrollView>
  );
}
