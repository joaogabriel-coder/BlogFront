import { Usuario, Publicacao, Comentario, Favorito } from "../types";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "./PostCard";

interface PerfilUsuarioPageProps {
  usuario: Usuario;
  publicacoes: Publicacao[];
  comentarios: Comentario[];
  favoritos: Favorito[];
  usuarioAtual: Usuario;
  onVoltar: () => void;
  onVerPost: (id: number) => void;
  onToggleFavorito: (publicacaoId: number) => void;
  onAdicionarComentario?: (novoComentario: Comentario) => void;
}

export function PerfilUsuarioPage({
  usuario,
  publicacoes,
  comentarios,
  favoritos,
  usuarioAtual,
  onVoltar,
  onVerPost,
  onToggleFavorito,
  onAdicionarComentario
}: PerfilUsuarioPageProps) {
  const publicacoesDoUsuario = publicacoes.filter(p => p.usuario_id === usuario.id);

  const obterIniciaisUsuario = (nome: string) => {
    return nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getCoresPerfil = (nome: string) => {
    const cores = [
      { bg: "bg-purple-500", text: "text-white" },
      { bg: "bg-blue-500", text: "text-white" },
      { bg: "bg-green-500", text: "text-white" },
      { bg: "bg-orange-500", text: "text-white" },
      { bg: "bg-pink-500", text: "text-white" },
      { bg: "bg-indigo-500", text: "text-white" },
      { bg: "bg-teal-500", text: "text-white" },
    ];
    const index = nome.charCodeAt(0) % cores.length;
    return cores[index];
  };

  const cores = getCoresPerfil(usuario.nome);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onVoltar}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Informações do usuário */}
      <div className="bg-card rounded-xl border border-border/50 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className={`h-24 w-24 rounded-full ${cores.bg} ${cores.text} flex items-center justify-center text-3xl shrink-0`}>
            {obterIniciaisUsuario(usuario.nome)}
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl">{usuario.nome}</h1>
            <p className="text-muted-foreground">{usuario.email}</p>
            <div className="flex gap-6 justify-center md:justify-start pt-2">
              <div className="text-center">
                <p className="text-2xl text-primary">{publicacoesDoUsuario.length}</p>
                <p className="text-sm text-muted-foreground">
                  {publicacoesDoUsuario.length === 1 ? "Publicação" : "Publicações"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publicações do usuário */}
      <div className="space-y-4">
        <h2 className="text-xl">Publicações</h2>
        {publicacoesDoUsuario.length === 0 ? (
          <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
            <p className="text-muted-foreground">
              Este usuário ainda não possui publicações
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicacoesDoUsuario.map(pub => {
              const isFavorito = favoritos.some(
                f => f.publicacao_id === pub.id && f.usuario_id === usuarioAtual.id
              );
              const totalFavoritos = favoritos.filter(f => f.publicacao_id === pub.id).length;

              return (
                <PostCard
                  key={pub.id}
                  publicacao={pub}
                  comentarios={comentarios}
                  usuarioAtual={usuarioAtual}
                  isFavorito={isFavorito}
                  totalFavoritos={totalFavoritos}
                  onVerMais={onVerPost}
                  onToggleFavorito={onToggleFavorito}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
