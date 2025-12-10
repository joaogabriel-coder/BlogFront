import { useState } from "react";
import { Publicacao, Comentario, Usuario, Favorito } from "../types";
import { PostCard } from "./PostCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter, TrendingUp, Clock, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BlogFeedProps {
  publicacoes: Publicacao[];
  comentarios: Comentario[];
  favoritos: Favorito[];
  usuarioAtual: Usuario;
  onVerPost?: (id: number) => void;
  onCriarPublicacao?: () => void;
  onToggleFavorito?: (publicacaoId: number) => void;
  onAdicionarComentario?: (publicacaoId: number, texto: string) => void;
  onVerPerfilUsuario?: (usuarioId: number) => void;
}

export function BlogFeed({ 
  publicacoes, 
  comentarios,
  favoritos,
  usuarioAtual,
  onVerPost, 
  onCriarPublicacao,
  onToggleFavorito,
  onAdicionarComentario,
  onVerPerfilUsuario
}: BlogFeedProps) {
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("recente");

  const publicacoesFiltradas = publicacoes
    .filter(pub =>
      pub.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      pub.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      pub.usuario?.nome.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenacao === "recente") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  const verificarSeFavorito = (publicacaoId: number) => {
    return favoritos.some(f => f.publicacao_id === publicacaoId && f.usuario_id === usuarioAtual.id);
  };

  const contarFavoritos = (publicacaoId: number) => {
    return favoritos.filter(f => f.publicacao_id === publicacaoId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end p-4 rounded-xl border border-border/50 bg-card/50">
        <Button
          onClick={onCriarPublicacao}
          className="bg-primary hover:bg-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Publicação
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título, conteúdo ou autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-input-background border-border"
          />
        </div>
        
        <Select value={ordenacao} onValueChange={setOrdenacao}>
          <SelectTrigger className="w-full md:w-[200px] bg-input-background border-border">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recente">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Mais recentes
              </div>
            </SelectItem>
            <SelectItem value="antigo">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Mais antigas
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {publicacoesFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicacoesFiltradas.map((publicacao) => (
            <PostCard
              key={publicacao.id}
              publicacao={publicacao}
              comentarios={comentarios}
              usuarioAtual={usuarioAtual}
              isFavorito={verificarSeFavorito(publicacao.id)}
              totalFavoritos={contarFavoritos(publicacao.id)}
              onVerMais={onVerPost}
              onToggleFavorito={onToggleFavorito}
              onAdicionarComentario={onAdicionarComentario}
              onVerPerfilUsuario={onVerPerfilUsuario}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4 bg-card border border-border rounded-xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3>Nenhuma publicação encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou filtros
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setBusca("")}
            className="mt-4 border-border"
          >
            Limpar busca
          </Button>
        </div>
      )}
    </div>
  );
}
