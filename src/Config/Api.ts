import axios from "axios";

// 1. Defina a Base URL:
// - Tenta usar a variável VITE_API_URL (que será injetada pela Vercel em produção)
// - Se não encontrar a variável (no desenvolvimento local), usa 'http://localhost:8000' como fallback.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Api = axios.create({
    baseURL: `${baseURL}` ,
    withCredentials: true,
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