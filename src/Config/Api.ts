import axios from "axios";

const Api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

// Adiciona o token automaticamente em TODAS as requisições
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default Api;