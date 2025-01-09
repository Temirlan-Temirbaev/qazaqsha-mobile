import {useForm} from 'react-hook-form';
import {View, Text, TextInput, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {useContext, useState} from "react";
import {client} from "@/source/shared/utils/apiClient";
import {Toast} from "@/source/shared/ui/toast";
import {AuthContext} from "@/source/app/AuthProvider";
import {saveToStore} from "@/source/shared/utils/saveToStore";
import { router } from 'expo-router';
import {LanguageContext} from "@/source/app/LanguageProvider";
export default function RegistrationForm() {
  const {setToken} = useContext(AuthContext);
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
    defaultValues: {
      username: '',
      password: '',
      fullName: '',
      sex: 'male',
      age: '',
      nation: 'Казах',
      mail: '',
      phone: '',
    },
  });
  const {t} = useContext(LanguageContext)
  const [isSexModalVisible, setSexModalVisible] = useState(false);
  const [isNationModalVisible, setNationModalVisible] = useState(false);

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
        setToken(r.data);
        await saveToStore("qazaqsha-token", r.data);
      })
      .catch((e) => {
        Toast.error(e.response.data.message, "top");
      });
  };

  const selectSex = (value: string) => {
    setValue('sex', value, {shouldValidate: true});
    setSexModalVisible(false);
  };

  const selectNation = (value: string) => {
    setValue('nation', value, {shouldValidate: true});
    setNationModalVisible(false);
  };

  return (
    <View style={{
      display : "flex",
      // alignItems : "flex-start",
      // flexDirection : "column",
      flex :1,
      minWidth : "100%",
    }}>
      {[
        { name: 'username', label: t("login"), placeholder: t("enterLogin"), type: 'text' },
        { name: 'password', label: t("password"), placeholder: t("enterPassword"), type: 'password' },
        { name: 'fullName', label: t("fullName"), placeholder: t("enterFullName"), type: 'text' },
        { name: 'mail', label: t("email"), placeholder: "example@mail.com", type: 'text' },
        { name: 'phone', label: t("phone"), placeholder: t("enterPhone"), type: 'text' },
      ].map(({ name, label, placeholder, type }) => (
        <View style={styles.formGroup} key={name}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={type === 'password'}
            keyboardType={name === 'age' ? 'numeric' : 'default'}
            value={watch(name)}
            onChangeText={(value) => setValue(name, value, { shouldValidate: true })}
            {...register(name, {
              required: t('edit-profile.required'),
              minLength: {
                value: name === "mail" || "phone" ? 0 : 4,
                message: t('edit-profile.minLength'),
              },
              pattern: name === 'mail' ? {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('edit-profile.invalidEmail'),
              } : name === 'phone' ? {
                value: /^\d{11}$/,
                message: t('edit-profile.invalidPhone'),
              } : undefined,
            })}
          />
          {errors[name] && <Text style={styles.error}>{errors[name]?.message}</Text>}
        </View>
      ))}

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("sex")}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setSexModalVisible(true)}>
          <Text>{watch('sex') === 'male' ? t("male") : t("female")}</Text>
        </TouchableOpacity>
        <Modal visible={isSexModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {[
                { value: 'male', label: t("male") },
                { value: 'female', label: t("female") },
              ].map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => selectSex(value)}
                  style={[
                    styles.modalOption,
                    watch('sex') === value && styles.selectedOption,
                  ]}
                >
                  <Text style={[styles.modalOptionText, watch('sex') === value && styles.selectedOptionText]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("nationality")}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setNationModalVisible(true)}>
          <Text>{watch('nation')}</Text>
        </TouchableOpacity>
        <Modal visible={isNationModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {[
                t("kazakh"), t("russian"), t("uyghur"), t("uzbek"), t("kyrgyz"), t("ukrainian"), t("belarusian"), t("otherNationality"),
              ].map((nation) => (
                <TouchableOpacity
                  key={nation}
                  onPress={() => selectNation(nation)}
                  style={[
                    styles.modalOption,
                    watch('nation') === nation && styles.selectedOption,
                  ]}
                >
                  <Text style={[styles.modalOptionText, watch('nation') === nation && styles.selectedOptionText]}>
                    {nation}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("age")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("enterAge")}
          keyboardType="numeric"
          value={watch('age')}
          onChangeText={(value) => setValue('age', parseInt(value, 10), { shouldValidate: true })}
          {...register('age', {
            required: t('edit-profile.required'),
            validate: (value) => !isNaN(value) && value > 0 || t('edit-profile.agePositive'),
          })}
        />
        {errors.age && <Text style={styles.error}>{errors.age.message}</Text>}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>{t("register")}</Text>
      </TouchableOpacity>

      <Text style={styles.dontHaveAnAccount}>
        {t("alreadyHaveAccount")}{' '}
        <TouchableOpacity onPress={() => router.push("/")} style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ fontFamily: "IBMPlexSans-Regular", textDecorationLine: "underline", color: "#6c38cc" }}>
            {t("loginHere")}
          </Text>
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
    alignItems: 'stretch',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#706EEC',
    backgroundColor: '#F0F0FF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#6c38cc',
    fontFamily : "IBMPlexSans-Bold"
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#706EEC',
  },
});