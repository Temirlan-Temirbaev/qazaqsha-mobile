import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Header from "@/components/auth/Header";
import RegistrationForm from "@/components/auth/RegistrationForm";

export default function RegistrationPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Регистрация</Text>
          <RegistrationForm />
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
    // justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 20
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: "IBMPlexSans-Bold"
  },
});