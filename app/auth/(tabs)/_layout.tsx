import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{

        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}