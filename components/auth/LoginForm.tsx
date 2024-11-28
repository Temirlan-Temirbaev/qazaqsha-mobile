import {useForm} from 'react-hook-form';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useContext} from "react";
import {AuthContext} from "@/source/app/AuthProvider";
import {saveToStore} from "@/source/shared/utils/saveToStore";
import {router} from "expo-router";
import {client} from "@/source/shared/utils/apiClient";
import {Toast} from "@/source/shared/ui/toast";

export default function LoginForm() {
  const {setToken} = useContext(AuthContext);
  const {register, handleSubmit, setValue, reset, watch, formState: {errors}} = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    await client.post("user/login", {
      username: data.username,
      password: data.password,
    })
      .then(async (r) => {
        setToken(r.data);
        await saveToStore("qazaqsha-token", r.data);
      })
      .catch(() => {
        Toast.error("Ошибка, Не удалось войти. Проверьте данные.", "top");
      });

    reset();
  };

  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Логин</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите логин..."
          value={watch('username')} // Привязка значения
          onChangeText={(value) => setValue('username', value, {shouldValidate: true})}
          {...register('username', {
            required: 'Логин обязателен.',
            minLength: {
              value: 4,
              message: 'Логин должен быть не менее 4 символов.',
            },
          })}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          value={watch('password')} // Привязка значения
          onChangeText={(value) => setValue('password', value, {shouldValidate: true})}
          {...register('password', {
            required: 'Пароль обязателен.',
            minLength: {
              value: 4,
              message: 'Пароль должен быть не менее 4 символов.',
            },
          })}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Войти</Text>
      </TouchableOpacity>
      <Text style={styles.dontHaveAnAccount}>Еще нет аккаунта?{' '}
        <TouchableOpacity onPress={() => router.push("/registration")} style={{display: "flex", alignItems: "center"}}>
          <Text style={{marginBottom: -4, textDecorationLine: "underline", color: "#6c38cc"}}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </Text>
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
    fontFamily: "IBMPlexSans-Bold"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontFamily: "IBMPlexSans-Bold"
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 4,
    fontFamily: "IBMPlexSans-SemiBold"

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
    fontFamily: "IBMPlexSans-Bold"
  },
  dontHaveAnAccount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#333",
    marginTop: 15,
    marginHorizontal: "auto",
    fontFamily: "IBMPlexSans-Bold"
  },
});