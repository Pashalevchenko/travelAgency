import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080", // поменяй если надо
});

// Подставляем токен в каждый запрос
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// http.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("token");
//     }
//     return Promise.reject(err);
//   }
// );