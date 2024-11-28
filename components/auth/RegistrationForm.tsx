import {useForm} from 'react-hook-form';
import {View, Text, TextInput, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {useContext, useState} from "react";
import {client} from "@/source/shared/utils/apiClient";
import {Toast} from "@/source/shared/ui/toast";
import {AuthContext} from "@/source/app/AuthProvider";
import {saveToStore} from "@/source/shared/utils/saveToStore";
import { router } from 'expo-router';

export default function RegistrationForm() {
  const {setToken} = useContext(AuthContext)
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
    defaultValues: {
      username: '',
      password: '',
      fullName: '',
      sex: 'male',
      age: '',
      nation: '',
      mail: '',
      phone: '',
    },
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const onSubmit = async (data: {
    username: string;
    password: string;
    fullName: string;
    sex: string;
    age: number;
    nation: string;
    mail: string;
    phone: string;
  }) => {
    await client.post("user/register", data)
      .then(async (r) => {
        setToken(r.data)
        await saveToStore("qazaqsha-token", r.data);
      })
      .catch((e) => {
        Toast.error(e.response.data.message, "top");
      });
  };

  const selectSex = (value: string) => {
    setValue('sex', value, {shouldValidate: true});
    setModalVisible(false);
  };

  return (
    <View>
      {[
        {name: 'username', label: 'Логин', placeholder: 'Введите логин...', type: 'text'},
        {name: 'password', label: 'Пароль', placeholder: 'Введите пароль...', type: 'password'},
        {name: 'fullName', label: 'Полное имя', placeholder: 'Введите полное имя...', type: 'text'},
        {name: 'nation', label: 'Национальность', placeholder: 'Введите национальность...', type: 'text'},
        {name: 'mail', label: 'Почта', placeholder: 'example@mail.com', type: 'text'},
        {name: 'phone', label: 'Телефон', placeholder: 'Введите номер...', type: 'text'},
      ].map(({name, label, placeholder, type}) => (
        <View style={styles.formGroup} key={name}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={type === 'password'}
            keyboardType={name === 'age' ? 'numeric' : 'default'}
            value={watch(name)}
            onChangeText={(value) => setValue(name, value, {shouldValidate: true})}
            {...register(name, {
              required: `${label} обязателен.`,
              minLength: {
                value: 4,
                message: `${label} должен быть не менее 4 символов.`,
              },
              pattern: name === 'mail' ? {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Некорректный формат почты.',
              } : name === 'phone' ? {
                value: /^\d{11}$/,
                message: 'Телефон должен содержать 11 цифр.',
              } : undefined,
            })}
          />
          {errors[name] && <Text style={styles.error}>{errors[name]?.message}</Text>}
        </View>
      ))}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Пол</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{watch('sex') === 'male' ? 'Мужской' : 'Женский'}</Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => selectSex('male')}>
                <Text style={styles.modalOption}>Мужской</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectSex('female')}>
                <Text style={styles.modalOption}>Женский</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Возраст</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите возраст..."
          keyboardType="numeric"
          value={watch('age')}
          onChangeText={(value) => setValue('age', parseInt(value, 10), {shouldValidate: true})}
          {...register('age', {
            required: 'Возраст обязателен.',
            validate: (value) => !isNaN(value) && value > 0 || 'Возраст должен быть положительным числом.',
          })}
        />
        {errors.age && <Text style={styles.error}>{errors.age.message}</Text>}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Зарегистрироваться</Text>
      </TouchableOpacity>
      <Text style={styles.dontHaveAnAccount}>Уже есть аккаунт?{' '}
        <TouchableOpacity onPress={() => router.push("/")} style={{display: "flex", alignItems: "center"}}>
          <Text style={{marginBottom: -4, textDecorationLine: "underline", color: "#6c38cc"}}>Войти</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
    color: '#6c38cc',
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