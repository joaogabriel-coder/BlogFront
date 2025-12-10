import axios from 'axios';

// Configure a URL base da sua API aqui
const API_BASE_URL = 'http://localhost:3000/api'; // ALTERE PARA A URL DA SUA API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;



export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  register: async (nome: string, email: string, senha: string) => {
    const response = await api.post('/auth/register', { nome, email, senha });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/usuario/perfil');
    return response.data;
  },
};

// ========== SERVIÇOS DE PUBLICAÇÕES ==========

export const publicacoesService = {
  getAll: async () => {
    const response = await api.get('/publicacoes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/publicacoes/${id}`);
    return response.data;
  },

  create: async (titulo: string, descricao: string, foto: string) => {
    const response = await api.post('/publicacoes', { titulo, descricao, foto });
    return response.data;
  },

  update: async (id: number, titulo: string, descricao: string) => {
    const response = await api.put(`/publicacoes/${id}`, { titulo, descricao });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/publicacoes/${id}`);
    return response.data;
  },

  getByUsuario: async (usuarioId: number) => {
    const response = await api.get(`/usuarios/${usuarioId}/publicacoes`);
    return response.data;
  },
};

// ========== SERVIÇOS DE COMENTÁRIOS ==========

export const comentariosService = {
  getAll: async () => {
    const response = await api.get('/comentarios');
    return response.data;
  },

  getByPublicacao: async (publicacaoId: number) => {
    const response = await api.get(`/publicacoes/${publicacaoId}/comentarios`);
    return response.data;
  },

  create: async (publicacaoId: number, texto: string) => {
    const response = await api.post('/comentarios', { publicacaoId, texto });
    return response.data;
  },

  update: async (id: number, texto: string) => {
    const response = await api.put(`/comentarios/${id}`, { texto });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/comentarios/${id}`);
    return response.data;
  },
};

// ========== SERVIÇOS DE FAVORITOS ==========

export const favoritosService = {
  getAll: async () => {
    const response = await api.get('/favoritos');
    return response.data;
  },

  create: async (publicacaoId: number) => {
    const response = await api.post('/favoritos', { publicacaoId });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/favoritos/${id}`);
    return response.data;
  },
};

// ========== SERVIÇOS DE USUÁRIO ==========

export const usuarioService = {
  getById: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  updateProfile: async (nome: string, email: string) => {
    const response = await api.put('/usuario/perfil', { nome, email });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/usuario/conta');
    return response.data;
  },
};
