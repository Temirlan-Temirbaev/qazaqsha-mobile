import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import Header from "@/components/auth/Header";
import LoginForm from "@/components/auth/LoginForm";
import {useContext} from "react";
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function LoginPage() {
  const {t} = useContext(LanguageContext)
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{t("loginTitle")}</Text>
          <LoginForm />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',

  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    display : "flex",
    alignItems : "center",
    flexDirection : "row"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical : 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    flex : 1,
    maxWidth : 400
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily : "IBMPlexSans-Bold"
  },
});