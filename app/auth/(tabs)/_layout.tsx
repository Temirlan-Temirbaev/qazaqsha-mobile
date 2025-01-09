import { Tabs } from 'expo-router';
import React, {useContext} from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function TabLayout() {
  const {t} = useContext(LanguageContext)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          default: {
            backgroundColor: '#fafafa',
            display: "flex",
            flexDirection: "row",
            alignItems : "center"
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          tabBarLabel : "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={focused ? '#6c38cc' : '#afb2bf'}
              />
              <Text style={[styles.tabLabel, focused && styles.activeLabel]}>
                {t('home.title')}
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel : "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={focused ? '#6c38cc' : '#afb2bf'}
              />
              <Text style={[styles.tabLabel, focused && styles.activeLabel]}>
                {t('profile.title')}
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width : 200,
  },
  tabLabel: {
    fontSize: 12,
    color: '#C0C0C3',
    fontFamily : "IBMPlexSans-Regular",
    // marginTop : 5
  },
  activeLabel: {
    color: '#6c38cc',
    fontWeight: '700',
  },
});