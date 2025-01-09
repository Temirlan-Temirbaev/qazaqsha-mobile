import { I18n } from "i18n-js";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import KK from "../languages/kk.json";
import RU from "../languages/ru.json";
import ENG from "../languages/en.json"
import {saveToStore} from "@/source/shared/utils/saveToStore";
import {receiveFromStore} from "@/source/shared/utils/receiveFromStore";

const translations = {
  kk: KK,
  ru: RU,
  en : ENG,
};

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.locale = "kk";

export const LanguageContext = createContext({
  lang: "kk",
  changeLang: (lang: string) => {},
  i18n,
  t: (val: string) => {},
});

export function LanguageProvider({ children }: PropsWithChildren) {
  const [lang, setLang] = useState("kk");

  const getStorageLocale = async () => {
    const receivedLocale = await receiveFromStore("qazaqsha-lang");
    if (!receivedLocale) {
      i18n.locale = "kk";
      return setLang("kk")
    };
    i18n.locale = receivedLocale;
    setLang(receivedLocale);
  };

  const changeLang = async (language: string) => {
    setLang(language);
    i18n.locale = language;
    await saveToStore("qazaqsha-lang", language);
  };

  useEffect(() => {
    getStorageLocale();
  }, []);

  const t = (val: string, obj?) => i18n.t(val, obj);
  return (
    <LanguageContext.Provider value={{ lang, changeLang, i18n, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
