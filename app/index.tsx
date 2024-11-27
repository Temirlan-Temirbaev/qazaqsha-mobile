import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import Header from "@/components/auth/Header";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Вход в аккаунт</Text>
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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});