// export interface Usuario {
//   id: number;
//   nome: string;
//   email: string;
// }

// export interface Publicacao {
//   id: number;
//   titulo: string;
//   foto: string;
//   descricao: string;
//   usuarioId: number;
//   usuario?: Usuario;
//   createdAt: string;
// }

// export interface Comentario {
//   id: number;
//   texto: string;
//   usuarioId: number;
//   publicacaoId: number;
//   usuario?: Usuario;
//   createdAt: string;
// }

// export interface Favorito {
//   id: number;
//   usuarioId: number;
//   publicacaoId: number;
// }

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Publicacao {
  id: number;
  titulo: string;
  descricao: string;
  foto: string;
  created_at: string;
  usuario?: Usuario;
  usuario_id: number;
  favoritos_count: number;
  favoritos: Favorito[];
  comentarios: Comentario[]
}

export interface Comentario {
  id: number;
  publicacao_id: number;
  usuario_id: number;
  texto: string;
  created_at: string;
  usuario?: Usuario;
}

export interface Favorito {
  id: number;
  publicacao_id: number;
  usuario_id: number;
}
