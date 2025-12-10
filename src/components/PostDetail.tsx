import { Publicacao, Comentario, Usuario } from "../types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UserProfile } from "./UserProfile";
import { CommentSection } from "./CommentSection";
import { Button } from "./ui/button";
import { Heart, ArrowLeft, Calendar, Eye } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PostDetailProps {
  publicacao: Publicacao;
  comentarios: Comentario[];
  usuarioAtual: Usuario;
  onVoltar?: () => void;
  onAdicionarComentario?: (novoComentario:  Comentario) => void;
  onEditarComentario?: (id: number, texto: string) => void;
  onApagarComentario?: (id: number) => void;
  onVerPerfilUsuario?: (usuarioId: number) => void;
}

export function PostDetail({
  publicacao,
  comentarios,
  usuarioAtual,
  onVoltar,
  onAdicionarComentario,
  onEditarComentario,
  onApagarComentario,
  onVerPerfilUsuario
}: PostDetailProps) {
  const [isFavorito, setIsFavorito] = useState(false);
  const [totalFavoritos, setTotalFavoritos] = useState(
    Math.floor(Math.random() * 50) + 5
  );

  const handleFavoritar = () => {
    setIsFavorito(!isFavorito);
    setTotalFavoritos(prev => isFavorito ? prev - 1 : prev + 1);
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onVoltar}
        className="mb-4 -ml-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-96 w-full overflow-hidden bg-muted">
          <ImageWithFallback
            src={publicacao.foto}
            alt={publicacao.titulo}
            className="h-full w-full object-cover"
          />
        </div>

        <CardHeader className="space-y-4">
          <h1>{publicacao.titulo}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            {publicacao.usuario && (
              <UserProfile 
                usuario={publicacao.usuario} 
                tamanho="md"
                onClick={() => onVerPerfilUsuario?.(publicacao.usuario!.id)}
              />
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatarData(publicacao.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {Math.floor(Math.random() * 500) + 100} visualizações
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant={isFavorito ? "default" : "outline"}
              onClick={handleFavoritar}
              className={isFavorito ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Heart
                className={`h-5 w-5 mr-2 ${isFavorito ? "fill-current" : ""}`}
              />
              {isFavorito ? "Favoritado" : "Favoritar"} ({totalFavoritos})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {publicacao.descricao}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CommentSection
          comentarios={comentarios}
          publicacaoId={publicacao.id}
          usuarioAtual={usuarioAtual}
          onAdicionarComentario={onAdicionarComentario}
          onEditarComentario={onEditarComentario}
          onApagarComentario={onApagarComentario}
        />
      </Card>
    </div>
  );
}
