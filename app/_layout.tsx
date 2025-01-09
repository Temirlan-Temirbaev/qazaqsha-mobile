import {useFonts} from "expo-font";
import {SplashScreen, Stack} from "expo-router";
import QueryProvider from "@/source/app/QueryProvider";
import {AuthProvider} from "@/source/app/AuthProvider";
import ToastManager from "@/source/shared/ui/toast/components/ToastManager";
import {StyleSheet} from "react-native";
import {useCallback} from "react";
import {setCustomText} from 'react-native-global-props';
import {LanguageProvider} from "@/source/app/LanguageProvider";

export default function Layout() {

  const [fontsLoaded, fontError] = useFonts({
    "IBMPlexSans-Bold": require("../assets/fonts/IBMPlexSans-Bold.ttf"),
    "IBMPlexSans-ExtraLight": require("../assets/fonts/IBMPlexSans-ExtraLight.ttf"),
    "IBMPlexSans-Medium": require("../assets/fonts/IBMPlexSans-Medium.ttf"),
    "IBMPlexSans-Regular": require("../assets/fonts/IBMPlexSans-Regular.ttf"),
    "IBMPlexSans-SemiBold": require("../assets/fonts/IBMPlexSans-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontsLoaded) {

    setCustomText({
      style: {
        fontFamily: "I"
      }
    })
  }

  return <QueryProvider>
    <AuthProvider>
      <LanguageProvider>
        <ToastManager
          position="bottom"
          animationInTiming={300}
          style={styles.toast}
        />
        <Stack screenOptions={{headerShown: false}}/>
      </LanguageProvider>
    </AuthProvider>

  </QueryProvider>
}


const styles = StyleSheet.create({
  toast: {
    bottom: 100,
    position: "absolute",
    right: 0,
    width: "100%",
  },
});