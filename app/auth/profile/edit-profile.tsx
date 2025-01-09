import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "@/source/app/AuthProvider";
import { TitleHeader } from "@/components/TitleHeader";
import { client } from "@/source/shared/utils/apiClient";
import { Toast } from "@/source/shared/ui/toast";
import {LanguageContext} from "@/source/app/LanguageProvider";

const updateProfile = async (updatedFields: { phone: string; mail: string; age: string }) => {
  const { data } = await client.put("user/update", updatedFields);
  return data;
};

const EditProfileScreen = () => {
  const { user: profile, refetch } = useContext(AuthContext);
  const { t } = useContext(LanguageContext); // Initialize translation hook
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { phone: profile?.phone, mail: profile?.mail, age: String(profile?.age) },
  });

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      Toast.success(t("edit-profile.success"));
      refetch();
    },
  });

  const watchedFields = watch();

  const onSubmit = () => {
    const updatedFields = Object.keys(watchedFields).reduce((acc, key) => {
      if (profile[key] !== watchedFields[key]) {
        acc[key] = watchedFields[key];
      }
      return acc;
    }, {});

    if (Object.keys(updatedFields).length === 0) {
      return;
    }
    saveProfile(updatedFields);
  };

  return (
    <SafeAreaView>
      <TitleHeader title={t("edit-profile.title")} />
      <View style={styles.container}>
        <View style={{
          maxWidth : 450,
          flex : 1
        }}>

        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-profile.phone")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("edit-profile.enterPhone")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            </View>
          )}
        />

        <Controller
          name="mail"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-profile.mail")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("edit-profile.enterEmail")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
              {errors.mail && <Text style={styles.errorText}>{errors.mail.message}</Text>}
            </View>
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-profile.age")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("edit-profile.enterAge")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSaving}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            borderRadius: 12,
            backgroundColor: "#6c38cc",
          }}
        >
          <Text style={{ fontFamily: "IBMPlexSans-Bold", fontSize: 16, color: "#fff" }}>
            {t("edit-profile.saveChanges")}
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    minHeight: Dimensions.get("screen").height - 60,
    display : 'flex',
    justifyContent : "center",
    flexDirection : "row",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontFamily: "IBMPlexSans-Bold",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "IBMPlexSans-Regular",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontFamily: "IBMPlexSans-Regular",
  },
});

export default EditProfileScreen;
