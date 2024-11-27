import axios, { AxiosInstance } from "axios";
import { receiveFromStore } from "./receiveFromStore";

const API_URL = "http://MacBook-Air-Erlan.local:3001/api/";
export const apiClient = () => {
  const headerConfig = {
    Accept: "application/json",
  };
  const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      post: headerConfig,
      get: headerConfig,
      delete: headerConfig,
    },
  });

  instance.interceptors.request.use(
    async function (config) {
      const t = await receiveFromStore("qazaqsha-token");
      config.headers.Authorization = `Bearer ${t}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const client = apiClient();
