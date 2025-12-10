import { useState } from "react";
import { Comentario, Usuario } from "../types";
import { UserProfile } from "./UserProfile";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Send, Trash2, Edit2, MessageCircle } from "lucide-react";
import Api from "@/Config/Api";

interface CommentSectionProps {
  comentarios: Comentario[];
  publicacaoId: number;
  usuarioAtual: Usuario;
  publicacaoProprietarioId?: number;
  onEditarComentario?: (id: number, texto: string) => void;
  onApagarComentario?: (id: number) => void;
  onAdicionarComentario?: (novoComentario: Comentario) => void;
}

export function CommentSection({
  comentarios,
  publicacaoId,
  usuarioAtual,
  publicacaoProprietarioId,
  onAdicionarComentario,
  onEditarComentario,
  onApagarComentario
}: CommentSectionProps) {
  const [novoComentario, setNovoComentario] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState("");
  

  const handleEnviar = async () => {
    if (!novoComentario.trim()) return;

    try {
        const response = await Api.post("/api/comentarios", {
            publicacao_id: publicacaoId, 
            texto: novoComentario,
        });
      
        onAdicionarComentario?.(response.data); 
        setNovoComentario("");

    } catch (error) {
        console.error("Erro ao enviar comentário:", error);
    }
  };

  const handleEditar = (comentario: Comentario) => {
    setEditandoId(comentario.id);
    setTextoEditado(comentario.texto);
  };

  const handleSalvarEdicao = (id: number) => {
    if (textoEditado.trim()) {
      onEditarComentario?.(id, textoEditado);
      setEditandoId(null);
      setTextoEditado("");
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setTextoEditado("");
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    const agora = new Date();
    const diff = agora.getTime() - date.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Ontem";
    if (dias < 7) return `${dias} dias atrás`;
    
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short"
    }).format(date);
  };

  const comentariosFiltrados = comentarios.filter(
    c => c.publicacao_id === publicacaoId
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">
          Comentários ({comentariosFiltrados.length})
        </h3>
        
        <div className="flex gap-3">
          <UserProfile usuario={usuarioAtual} tamanho="sm" />
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Adicione um comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              className="resize-none min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleEnviar}
                disabled={!novoComentario.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comentariosFiltrados.map((comentario) => (
          <Card key={comentario.id} className="p-4">
            <div className="flex gap-3">
              {comentario.usuario && (
                <div className="flex-shrink-0">
                  <UserProfile usuario={comentario.usuario} tamanho="sm" />
                </div>
              )}
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground break-all">
                    {formatarData(comentario.created_at)}
                  </span>
                  
                  {(comentario.usuario_id === usuarioAtual.id || publicacaoProprietarioId === usuarioAtual.id) && (
                    <div className="flex gap-1">
                      {comentario.usuario_id === usuarioAtual.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(comentario)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApagarComentario?.(comentario.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title={publicacaoProprietarioId === usuarioAtual.id && comentario.usuario_id !== usuarioAtual.id ? "Apagar comentário (proprietário da publicação)" : "Apagar comentário"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {editandoId === comentario.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="resize-none min-h-[60px] "
                      
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelarEdicao}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSalvarEdicao(comentario.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm break-all">{comentario.texto}</p>
                )}
              </div>
            </div>
          </Card>
        ))}

        {comentariosFiltrados.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
