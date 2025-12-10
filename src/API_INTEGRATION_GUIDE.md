# 🚀 Guia de Integração com API

Este documento explica como integrar o frontend com sua API backend.

## 📋 Estrutura Recomendada

### 1️⃣ Crie um arquivo de serviço de API

```typescript
// /lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sua-api.com/api', // Substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🔐 Endpoints de Autenticação

### Login
```typescript
// POST /auth/login
const handleLogin = async (email: string, senha: string) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    localStorage.setItem('token', response.data.token);
    setUsuarioAtual(response.data.usuario);
    setPaginaAtual("feed");
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Email ou senha inválidos');
  }
};
```

### Cadastro
```typescript
// POST /auth/register
const handleCriarConta = async (nome: string, email: string, senha: string) => {
  try {
    const response = await api.post('/auth/register', { nome, email, senha });
    localStorage.setItem('token', response.data.token);
    setUsuarioAtual(response.data.usuario);
    setPaginaAtual("feed");
  } catch (error) {
    console.error('Erro no cadastro:', error);
    alert('Erro ao criar conta');
  }
};
```

### Logout
```typescript
// POST /auth/logout
const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setUsuarioAtual(null);
    setPaginaAtual("login");
  } catch (error) {
    console.error('Erro no logout:', error);
  }
};
```

## 📝 Endpoints de Publicações

### Listar Publicações
```typescript
// GET /publicacoes
useEffect(() => {
  const fetchPublicacoes = async () => {
    try {
      const response = await api.get('/publicacoes');
      setPublicacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
    }
  };
  
  if (usuarioAtual) {
    fetchPublicacoes();
  }
}, [usuarioAtual]);
```

### Criar Publicação
```typescript
// POST /publicacoes
const handlePostar = async (titulo: string, descricao: string, foto: string) => {
  try {
    const response = await api.post('/publicacoes', { titulo, descricao, foto });
    setPublicacoes([response.data, ...publicacoes]);
    setModalCriarAberto(false);
    toast.success('Publicação criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    toast.error('Erro ao criar publicação');
  }
};
```

### Editar Publicação
```typescript
// PUT /publicacoes/:id
const handleEditarPublicacao = async (id: number, titulo: string, descricao: string) => {
  try {
    const response = await api.put(`/publicacoes/${id}`, { titulo, descricao });
    setPublicacoes(publicacoes.map(p => p.id === id ? response.data : p));
    setModalEditarAberto(false);
    toast.success('Publicação editada com sucesso!');
  } catch (error) {
    console.error('Erro ao editar publicação:', error);
    toast.error('Erro ao editar publicação');
  }
};
```

### Apagar Publicação
```typescript
// DELETE /publicacoes/:id
const handleApagarPublicacao = async (id: number) => {
  try {
    await api.delete(`/publicacoes/${id}`);
    setPublicacoes(publicacoes.filter(p => p.id !== id));
    handleVoltar();
    toast.success('Publicação apagada com sucesso!');
  } catch (error) {
    console.error('Erro ao apagar publicação:', error);
    toast.error('Erro ao apagar publicação');
  }
};
```

## 💬 Endpoints de Comentários

### Listar Comentários
```typescript
// GET /comentarios ou GET /publicacoes/:id/comentarios
useEffect(() => {
  const fetchComentarios = async () => {
    try {
      const response = await api.get('/comentarios');
      setComentarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };
  
  if (usuarioAtual) {
    fetchComentarios();
  }
}, [usuarioAtual]);
```

### Adicionar Comentário
```typescript
// POST /comentarios
const handleAdicionarComentario = async (publicacaoId: number, texto: string) => {
  try {
    const response = await api.post('/comentarios', { publicacaoId, texto });
    setComentarios([...comentarios, response.data]);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
  }
};
```

### Editar Comentário
```typescript
// PUT /comentarios/:id
const handleEditarComentario = async (id: number, texto: string) => {
  try {
    const response = await api.put(`/comentarios/${id}`, { texto });
    setComentarios(comentarios.map(c => c.id === id ? response.data : c));
  } catch (error) {
    console.error('Erro ao editar comentário:', error);
  }
};
```

### Apagar Comentário
```typescript
// DELETE /comentarios/:id
const handleApagarComentario = async (id: number) => {
  try {
    await api.delete(`/comentarios/${id}`);
    setComentarios(comentarios.filter(c => c.id !== id));
  } catch (error) {
    console.error('Erro ao apagar comentário:', error);
  }
};
```

## ❤️ Endpoints de Favoritos

### Listar Favoritos
```typescript
// GET /favoritos
useEffect(() => {
  const fetchFavoritos = async () => {
    try {
      const response = await api.get('/favoritos');
      setFavoritos(response.data);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };
  
  if (usuarioAtual) {
    fetchFavoritos();
  }
}, [usuarioAtual]);
```

### Toggle Favorito
```typescript
// POST /favoritos ou DELETE /favoritos/:id
const handleToggleFavorito = async (publicacaoId: number) => {
  try {
    const favoritoExiste = favoritos.find(
      f => f.publicacaoId === publicacaoId && f.usuarioId === usuarioAtual.id
    );
    
    if (favoritoExiste) {
      await api.delete(`/favoritos/${favoritoExiste.id}`);
      setFavoritos(favoritos.filter(f => f.id !== favoritoExiste.id));
    } else {
      const response = await api.post('/favoritos', { publicacaoId });
      setFavoritos([...favoritos, response.data]);
    }
  } catch (error) {
    console.error('Erro ao favoritar:', error);
  }
};
```

## 👤 Endpoints de Usuário

### Obter Perfil
```typescript
// GET /usuario/perfil
useEffect(() => {
  const fetchPerfil = async () => {
    try {
      const response = await api.get('/usuario/perfil');
      setUsuarioAtual(response.data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    fetchPerfil();
  }
}, []);
```

### Editar Conta
```typescript
// PUT /usuario/perfil
const handleEditarConta = async (nome: string, email: string) => {
  try {
    const response = await api.put('/usuario/perfil', { nome, email });
    setUsuarioAtual(response.data);
    toast.success('Conta atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao editar conta:', error);
    toast.error('Erro ao editar conta');
  }
};
```

### Excluir Conta
```typescript
// DELETE /usuario/conta
const handleExcluirConta = async () => {
  try {
    await api.delete('/usuario/conta');
    localStorage.removeItem('token');
    setUsuarioAtual(null);
    setPaginaAtual("login");
    toast.success('Conta excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    toast.error('Erro ao excluir conta');
  }
};
```

### Obter Usuário Específico
```typescript
// GET /usuarios/:id
const fetchUsuario = async (usuarioId: number) => {
  try {
    const response = await api.get(`/usuarios/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};
```

## 🎯 Exemplo Completo de Integração no App.tsx

```typescript
import { useState, useEffect } from "react";
import api from "./lib/api";
import { toast } from "sonner@2.0.3";

function App() {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchDados();
    }
  }, []);

  const fetchDados = async () => {
    try {
      const [perfilRes, pubsRes, comsRes, favsRes] = await Promise.all([
        api.get('/usuario/perfil'),
        api.get('/publicacoes'),
        api.get('/comentarios'),
        api.get('/favoritos')
      ]);
      
      setUsuarioAtual(perfilRes.data);
      setPublicacoes(pubsRes.data);
      setComentarios(comsRes.data);
      setFavoritos(favsRes.data);
      setPaginaAtual("feed");
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      localStorage.removeItem('token');
    }
  };

  // ... resto do código
}
```

## 📌 Notas Importantes

1. **Substitua `https://sua-api.com/api`** pela URL real da sua API
2. **Ajuste os endpoints** conforme a estrutura da sua API
3. **Trate erros** adequadamente com try/catch
4. **Use feedback visual** com toast para ações do usuário
5. **Gerencie o token** de autenticação (localStorage ou cookies)
6. **Adicione loading states** durante requisições (opcional)

## 🔄 Estados de Loading (Opcional)

```typescript
const [loading, setLoading] = useState(false);

const handleLogin = async (email: string, senha: string) => {
  setLoading(true);
  try {
    // ... código de login
  } catch (error) {
    // ... tratamento de erro
  } finally {
    setLoading(false);
  }
};
```
