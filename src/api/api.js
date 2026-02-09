import axios from "axios";
import i18n from "../i18n";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const lang = i18n.language || "en"; // "uk" или "en"
  config.headers["Accept-Language"] = lang;
  return config;
});