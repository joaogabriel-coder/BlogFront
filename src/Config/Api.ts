import axios from "axios";

// 1. Defina a Base URL:
// - Tenta usar a variável VITE_API_URL (que será injetada pela Vercel em produção)
// - Se não encontrar a variável (no desenvolvimento local), usa 'http://localhost:8000' como fallback.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Api = axios.create({
    // 2. Combine a URL base com o prefixo do Laravel se necessário (opcional)
    // Se suas rotas são tipo /api/login, use `${baseURL}/api`
    // Se suas rotas são tipo /login, use `${baseURL}`
    baseURL: `${baseURL}` // Sugestão: adicione o prefixo /api aqui.
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