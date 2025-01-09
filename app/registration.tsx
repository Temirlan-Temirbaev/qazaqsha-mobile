import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Header from "@/components/auth/Header";
import RegistrationForm from "@/components/auth/RegistrationForm";
import {useContext} from "react";
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function RegistrationPage() {
  const {t} = useContext(LanguageContext)
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>{t("register")}</Text>
            <RegistrationForm />
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 12,
    marginVertical: 20,
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "row"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    flex: 1,
    maxWidth : 450
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: "IBMPlexSans-Bold"
  },
});