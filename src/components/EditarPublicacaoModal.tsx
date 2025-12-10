import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Edit2 } from "lucide-react";
import { Publicacao } from "../types";

interface EditarPublicacaoModalProps {
  aberto: boolean;
  publicacao: Publicacao | null;
  onFechar: () => void;
  onEditar: (id: number, titulo: string, descricao: string) => void;
}

export function EditarPublicacaoModal({
  aberto,
  publicacao,
  onFechar,
  onEditar
}: EditarPublicacaoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (publicacao) {
      setTitulo(publicacao.titulo);
      setDescricao(publicacao.descricao);
    }
  }, [publicacao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publicacao && titulo.trim() && descricao.trim()) {
      onEditar(publicacao.id, titulo.trim(), descricao.trim());
      handleFechar();
    }
  };

  const handleFechar = () => {
    setTitulo("");
    setDescricao("");
    onFechar();
  };

  if (!publicacao) return null;

  return (
    <Dialog open={aberto} onOpenChange={handleFechar}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            Editar Publicação
          </DialogTitle>
          <DialogDescription>
            Atualize o título e a descrição da sua publicação. A imagem será mantida.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título da publicação"
                className="bg-input-background border-border text-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o conteúdo da sua publicação..."
                className="min-h-[120px] resize-none bg-input-background border-border text-black"
                required
              />
              <p className="text-xs text-muted-foreground">
                {descricao.length} caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label>Imagem atual</Label>
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={publicacao.foto}
                  alt={publicacao.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                A imagem não pode ser alterada
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleFechar}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!titulo.trim() || !descricao.trim()}
              className="bg-primary hover:bg-secondary"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
