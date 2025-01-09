import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '@/components/auth/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { AuthContext } from '@/source/app/AuthProvider';
import {FontAwesome6} from "@expo/vector-icons"
import { SvgXml } from 'react-native-svg';
import { EditSvg } from '@/assets/icons/edit';
import { ArrowIcon } from '@/assets/icons/arrow';
import { EditPasswordIcon } from '@/assets/icons/editPassword';
import { router } from 'expo-router';
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function ProfileScreen() {
  const {logout, user} = useContext(AuthContext)
  const {t} = useContext(LanguageContext)
  if (!user) return
  return (
    <SafeAreaView>
      <Header />
      <View
        style={{
          display : "flex",
          flexDirection: "column",
          gap: 20,
          padding: 16
        }}
      >
        <View style={{
          display :"flex",
          alignItems : "center",
          flexDirection: "row",
          gap : 20
        }}>
          <View style={{
            width: 64,
            height: 64,
            backgroundColor: "rgba(247, 247, 247, 1)",
            borderRadius: 10000,
            display: "flex",
            alignItems :"center",
            justifyContent: "center"
          }}>
            <FontAwesome6 name="user" size={24} color="rgba(218, 220, 224, 1)" />
          </View>
          <View>
            <Text style={{
              fontFamily : "IBMPlexSans-Bold",
              fontSize: 20,
              color : "rgba(21, 19, 36, 1)"
            }}>
              {user.fullName}
            </Text>
            <Text
              style={{
                fontFamily : "IBMPlexSans-Regular",
                fontSize: 14,
                color : "rgba(134, 134, 136, 1)"
              }}
            >
              @{user.username}
            </Text>
          </View>
        </View>
        <View>
        <View style={[styles.infoContainer, styles.borderBottom]}>
          <Text style={styles.labelText}>{t("edit-profile.mail")}</Text>
          <Text style={styles.infoText}>{user.mail}</Text>
        </View>

          <View style={[styles.infoContainer, styles.borderBottom]}>
        <Text style={styles.labelText}>{t("edit-profile.phone")}</Text>
        <Text style={styles.infoText}>{user.phone}</Text>
      </View>
    </View>
        <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/auth/profile/edit-profile")}
        style={[styles.option, styles.optionBorder]}
      >
        <View style={styles.optionContent}>
          <SvgXml xml={EditSvg} />
          <Text style={styles.optionText}>{t("edit-profile.title")}</Text>
        </View>
        <SvgXml xml={ArrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/profile/edit-password")}
        style={styles.option}
      >
        <View style={styles.optionContent}>
          <SvgXml xml={EditPasswordIcon} />
          <Text style={styles.optionText}>{t("edit-password.changePassword")}</Text>
        </View>
        <SvgXml xml={ArrowIcon} />
      </TouchableOpacity>
    </View>
        <TouchableOpacity
          style={{
            backgroundColor : "rgba(247, 248, 250, 1)",
            display : "flex",
            justifyContent : "center",
            alignItems : "center",
            height : 45,
            borderRadius: 12,
            maxWidth : 400
          }}
          onPress={logout}
        >
          <Text style={{
            fontFamily : "IBMPlexSans-Bold",
            fontSize : 14,
            color : "rgba(235, 85, 85, 1)",

          }}>
            {t("logout")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDEEF0",
    // maxWidth : 400
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDEEF0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // approximate gap between icons and text
  },
  optionText: {
    fontFamily: "IBMPlexSans-Medium",
    fontSize: 14,
    lineHeight: 15,
    fontWeight: "500",
  },
  infoContainer: {
    padding: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDEEF0",
  },
  labelText: {
    fontSize: 13,
    color: "#C0C0C3",
    fontFamily : "IBMPlexSans-Bold"
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500", // Medium equivalent
    fontFamily: "IBMPlexSans-Medium", // Ensure this font is loaded in the project
    marginTop: 8, // Approximate equivalent for `mt-2`
  },
});