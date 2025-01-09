import React, { useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "@/source/app/AuthProvider";
import { TitleHeader } from "@/components/TitleHeader";
import { client } from "@/source/shared/utils/apiClient";
import { Toast } from "@/source/shared/ui/toast";
import {LanguageContext} from "@/source/app/LanguageProvider";

const changePassword = async (passwordData: { oldPassword: string; newPassword: string, confirmPassword: string }) => {
  const { data } = await client.put("user/change-password", passwordData);
  return data;
};

const ChangePasswordScreen = () => {
  const { refetch } = useContext(AuthContext);
  const { t } = useContext(LanguageContext); // Initialize translation hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { mutate: savePassword, isPending: isSaving } = useMutation(
    {
      mutationFn: changePassword,
      onSuccess: () => {
        Toast.success(t("edit-password.success")); // Use translation
        refetch();
        reset();
      },
      onError: () => {
        Toast.error(t("edit-password.error"), "bottom-right");
      },
    }
  );

  const onSubmit = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      Toast.error(t("edit-password.passwordsMismatch"), "bottom-right");
      return;
    }
    savePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword, confirmPassword: data.confirmPassword });
  };

  return (
    <SafeAreaView>
      <TitleHeader title={t("edit-password.changePassword")} /> {/* Translate Title */}
      <View style={styles.container}>
        <View style={{
          flex : 1,
          maxWidth : 450
        }}>


        <Controller
          name="oldPassword"
          control={control}
          rules={{ required: t("edit-password.required") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-password.oldPassword")}</Text> {/* Translate label */}
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.oldPassword && (
                <Text style={styles.errorText}>{errors.oldPassword.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          rules={{ required: t("edit-password.required"), minLength: { value: 4, message: t("edit-password.minLength") } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-password.newPassword")}</Text> {/* Translate label */}
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{ required: t("edit-password.required") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("edit-password.confirmPassword")}</Text> {/* Translate label */}
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}
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
          <Text
            style={{
              fontFamily: "IBMPlexSans-Bold",
              fontSize: 16,
              color: "#fff",
            }}
          >
            {t("edit-password.save")} {/* Translate button text */}
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
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
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

export default ChangePasswordScreen;
