import {useForm} from 'react-hook-form';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useContext} from "react";
import {AuthContext} from "@/source/app/AuthProvider";
import {saveToStore} from "@/source/shared/utils/saveToStore";
import {router} from "expo-router";
import {client} from "@/source/shared/utils/apiClient";
import {Toast} from "@/source/shared/ui/toast";
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function LoginForm() {
  const {setToken} = useContext(AuthContext);
  const { t: translate } = useContext(LanguageContext)
  const t = (s: string) => translate(s)
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
        <Text style={styles.label}>{t("login")}</Text> {/* Перевод заголовка */}
        <TextInput
          style={styles.input}
          placeholder={t("enterLogin")}
          value={watch('username')}
          onChangeText={(value) => setValue('username', value, { shouldValidate: true })}
          {...register('username', {
            required: t('edit-profile.required'),
            minLength: {
              value: 4,
              message: t('edit-profile.minLength'),
            },
          })}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("password")}</Text> {/* Перевод заголовка */}
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          value={watch('password')} // Привязка значения
          onChangeText={(value) => setValue('password', value, { shouldValidate: true })}
          {...register('password', {
            required: t('edit-profile.required'),
            minLength: {
              value: 4,
              message: t('edit-profile.minLength'),
            },
          })}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>{t("loginButton")}</Text> {/* Перевод кнопки */}
      </TouchableOpacity>
      <Text style={styles.dontHaveAnAccount}>{t("noAccount")}{' '}
        <TouchableOpacity onPress={() => router.push("/registration")} style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ textDecorationLine: "underline", color: "#6c38cc" , fontFamily : "IBMPlexSans-Regular"}}>{t("registerHere")}</Text> {/* Перевод текста регистрации */}
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