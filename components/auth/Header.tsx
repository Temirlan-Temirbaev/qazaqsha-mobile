import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {useContext, useState} from 'react';
import {LanguageContext} from "@/source/app/LanguageProvider";

export default function Header() {
  const { lang, changeLang} = useContext(LanguageContext)
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>QazaQsha</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, lang === 'ru' && styles.activeButton]}
          onPress={() => changeLang('ru')}
        >
          <Text style={[styles.buttonText, lang === 'ru' && styles.activeButtonText]}>Русский</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, lang === 'kk' && styles.activeButton]}
          onPress={() => changeLang('kk')}
        >
          <Text style={[styles.buttonText, lang === 'kk' && styles.activeButtonText]}>Қазақша</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c38cc',
    fontFamily: "IBMPlexSans-Bold"
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#6c38cc',
    borderColor: '#6c38cc',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontFamily: "IBMPlexSans-SemiBold"
  },
  activeButtonText: {
    color: '#fff',
  },
});