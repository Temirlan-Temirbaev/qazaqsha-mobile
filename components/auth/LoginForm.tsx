import {useForm} from 'react-hook-form';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "@/source/app/AuthProvider";
import {saveToStore} from "@/source/shared/utils/saveToStore";

export default function LoginForm() {
  const {setToken} = useContext(AuthContext)
  const {register, handleSubmit, setValue, watch, reset, formState} = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const errors = formState.errors
  const onSubmit = async (data: { username: string, password: string }) => {
    Alert.alert(JSON.stringify(data))
    const res = await axios.post("http://MacBook-Air-Erlan.local:3001/api/user/login", {
      username: data.username,
      password: data.password,
    }).then(async r => {
        setToken(r.data)
        await saveToStore("qazaqsha-token", r.data);
      }
    ).catch(e => console.log(e))
    reset();
  };

  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Логин</Text>
        <TextInput
          style={styles.input}
          placeholder="FooFie"
          onChangeText={(value) => setValue('username', value)}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          onChangeText={(value) => setValue('password', value)}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#6c38cc',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});