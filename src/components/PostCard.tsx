import { Publicacao, Comentario, Usuario } from "../types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { UserProfile } from "./UserProfile";
import { Heart, MessageCircle, Calendar, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PostCardProps {
  publicacao: Publicacao;
  comentarios?: Comentario[];
  usuarioAtual?: Usuario;
  isFavorito?: boolean;
  totalFavoritos?: number;
  onVerMais?: (id: number) => void;
  onToggleFavorito?: (publicacaoId: number) => void
  onAdicionarComentario?: (publicacaoId: number, texto: string) => void;
  onVerPerfilUsuario?: (usuarioId: number) => void;
}

export function PostCard({ 
  publicacao, 
  comentarios,
  usuarioAtual,
  isFavorito,
  totalFavoritos,
  onVerMais,
  onToggleFavorito,
  onAdicionarComentario,
  onVerPerfilUsuario
}: PostCardProps) {
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentario, setComentario] = useState("");

  const comentariosDaPublicacao = comentarios.filter(c => c.publicacao_id === publicacao.id);

  const handleFavoritar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorito?.(publicacao.id);
  };

  const handleToggleComentarios = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMostrarComentarios(!mostrarComentarios);
    if (!mostrarComentarios) {
      setComentario("");
    }
  };

  const handleEnviarComentario = () => {
  const textoComentario = comentario.trim(); 
    if (textoComentario && publicacao && publicacao.id) {
        onAdicionarComentario?.(publicacao.id, textoComentario); 
        setComentario("");
    }
};

  const handleCardClick = () => {
    if (!mostrarComentarios) {
      onVerMais?.(publicacao.id);
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "Data indisponível";

  const date = new Date(data);

  // se der erro ao converter
  if (isNaN(date.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
  };

  const formatarDataComentario = (data: string) => {
    const date = new Date(data);
    const agora = new Date();
    const diff = agora.getTime() - date.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return "agora";
    if (minutos < 60) return `${minutos}min`;
    if (horas < 24) return `${horas}h`;
    if (dias < 7) return `${dias}d`;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short"
    }).format(date);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <ImageWithFallback
          src={publicacao.foto}
          alt={publicacao.titulo}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          {publicacao.usuario && (
            <UserProfile 
              usuario={publicacao.usuario} 
              tamanho="sm"
              onClick={() => onVerPerfilUsuario?.(publicacao.usuario!.id)}
            />
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatarData(publicacao.created_at)}
          </div>
        </div>
        <h3 className="hover:text-primary transition-colors">
          {publicacao.titulo}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {publicacao.descricao}
        </p>
      </CardContent>

      

        {mostrarComentarios && (
          <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex gap-2">
              <Input
                placeholder="Escreva um comentário..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && comentario.trim()) {
                   
                  }
                }}
                className="bg-input-background border-border"
              />
              <Button
                size="icon"
                onClick={handleEnviarComentario}
                disabled={!comentario.trim()}
                className="bg-primary hover:bg-secondary shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {comentariosDaPublicacao.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comentariosDaPublicacao.map(com => (
                  <div key={com.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                          {com.usuario?.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-sm">{com.usuario?.nome}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {/* {formatarDataComentario(com.createdAt)} */}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">{com.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </Card>
  );
}
