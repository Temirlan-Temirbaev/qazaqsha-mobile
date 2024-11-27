import {ScrollView, Text} from 'react-native';
import {useContext} from "react";
import {AuthContext} from "@/source/app/AuthProvider";


export default function HomeScreen() {
  const {user} = useContext(AuthContext)
  if (!user) return;
  return (
    <ScrollView>
      <Text>{user.username}</Text>
    </ScrollView>
  );
}
