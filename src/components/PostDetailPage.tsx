import { Publicacao, Comentario, Usuario } from "../types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UserProfile } from "./UserProfile";
import { CommentSection } from "./CommentSection";
import { Button } from "./ui/button";
import { Heart, ArrowLeft, Calendar, Edit2, Trash2, ApertureIcon } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";



interface PostDetailPageProps {
  publicacao: Publicacao;
  comentarios: Comentario[];
  usuarioAtual: Usuario;
  onVoltar?: () => void;
  onAdicionarComentario?: (novoComentario: Comentario) => void;
  onEditarComentario?: (id: number, texto: string) => void;
  onApagarComentario?: (id: number) => void;
  onEditarPublicacao?: (id: number) => void;
  onApagarPublicacao?: (id: number) => void;
  onVerPerfilUsuario?: (usuarioId: number) => void;
  isFavoritoInicial: boolean;
  totalFavoritosInicial: number;
  onToggleFavorito: (publicacaoId: number) => void;
}

export function PostDetailPage({
  publicacao,
  comentarios,
  usuarioAtual,
  onVoltar,
  onAdicionarComentario,
  onEditarComentario,
  onApagarComentario,
  onEditarPublicacao,
  onApagarPublicacao,
  onVerPerfilUsuario,
  isFavoritoInicial,
  totalFavoritosInicial,
  onToggleFavorito
}: PostDetailPageProps) {
  const [isFavorito, setIsFavorito] = useState(isFavoritoInicial);
  const [totalFavoritos, setTotalFavoritos] = useState(totalFavoritosInicial);
  const [mostrarDialogoApagar, setMostrarDialogoApagar] = useState(false);

  const handleFavoritar =  async () => {
    onToggleFavorito(publicacao.id); 
    const novoStatus = !isFavorito;
    setIsFavorito(novoStatus);
    setTotalFavoritos((prev) => (novoStatus ? prev + 1 : prev - 1));
  };
  useEffect(() => {
        setTotalFavoritos(totalFavoritosInicial);
    }, [totalFavoritosInicial]);

  const formatarData = (data: string) => {
    if (!data) return "Data indisponível";

    const date = new Date(data);

    if (isNaN(date.getTime())) {
      return "Data inválida ou ausente";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  
  const ehProprietario = publicacao?.usuario_id === usuarioAtual?.id;

  const handleConfirmarApagar =  () => {
    onApagarPublicacao?.(publicacao.id);
    setMostrarDialogoApagar(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onVoltar} className="hover:bg-accent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {ehProprietario && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEditarPublicacao?.(publicacao.id)}
              className="border-border hover:bg-accent"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setMostrarDialogoApagar(true)}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Apagar
            </Button>
          </div>
        )}
      </div>

      <Card className="overflow-hidden border-border shadow-lg">
        <div className="relative h-96 w-full overflow-hidden bg-muted">
          <ImageWithFallback
            src={publicacao.foto}
            alt={publicacao.titulo}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl text-white drop-shadow-lg">
              {publicacao.titulo}
            </h1>
          </div>
        </div>

        <CardHeader className="space-y-4 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {publicacao.usuario && (
              <UserProfile
                usuario={publicacao.usuario}
                tamanho="md"
                onClick={() => onVerPerfilUsuario?.(publicacao.usuario!.id)}
              />
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatarData(publicacao.created_at)}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant={isFavorito ? "default" : "outline"}
              onClick={handleFavoritar}
              className={
                isFavorito
                  ? "bg-primary hover:bg-secondary"
                  : "border-border hover:bg-accent"
              }
            >
              <Heart
                className={`h-5 w-5 mr-2 ${isFavorito ? "fill-current" : ""}`}
              />
              {isFavorito ? "Favoritado" : "Favoritar"} ({totalFavoritos})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-card">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-line break-words">
              {publicacao.descricao}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 border-border shadow-lg bg-card">
        <CommentSection
          comentarios={comentarios}
          publicacaoId={publicacao.id}
          usuarioAtual={usuarioAtual}
          publicacaoProprietarioId={publicacao.usuario_id}
          onAdicionarComentario={onAdicionarComentario}
          onEditarComentario={onEditarComentario}
          onApagarComentario={onApagarComentario}
        />
      </Card>

      <AlertDialog
        open={mostrarDialogoApagar}
        onOpenChange={setMostrarDialogoApagar}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja apagar esta publicação? Esta ação não pode
              ser desfeita. Todos os comentários também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarApagar}
              className="bg-destructive hover:bg-destructive/90"
            >
              Apagar publicação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
