import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ImagePlus, X, Send, Image } from "lucide-react";

interface CriarPublicacaoModalProps {
  aberto: boolean;
  onFechar: () => void;
  onPostar: (titulo: string, descricao: string, foto: File) => void;
}

export function CriarPublicacaoModal({
  aberto,
  onFechar,
  onPostar,
}: CriarPublicacaoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [urlTemporaria, setUrlTemporaria] = useState("");
  const [previewFoto, setPreviewFoto] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim() || !foto) return;

    const arquivoFoto = await urlParaFile(urlTemporaria, "imagem.jpg");

    onPostar(titulo.trim(), descricao.trim(), arquivoFoto);

    // limpar camposF
    setTitulo("");
    setDescricao("");
    setFoto(null);
  };

  const handleLimpar = () => {
    setTitulo("");
    setDescricao("");
    setFoto(null);
    setPreviewFoto("");
    setUrlTemporaria("");
  };

  const handleFechar = () => {
    handleLimpar();
    onFechar();
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFoto(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewFoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCarregarPreview = async () => {
    if (!urlTemporaria.trim()) return;
    const arquivoFoto = await urlParaFile(urlTemporaria, "imagem.jpg");
    setFoto(arquivoFoto);
    setPreviewFoto(urlTemporaria);
  };

  const handleRemoverFoto = () => {
    setFoto(null);
    setPreviewFoto("");
    setUrlTemporaria("");
  };

  async function urlParaFile(url: string, nomeArquivo: string): Promise<File> {
    const resposta = await fetch(url);
    const blob = await resposta.blob(); 
    return new File([blob], nomeArquivo, { type: blob.type });
  }

  // Auto-carregar preview quando colar URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        urlTemporaria &&
        urlTemporaria.length > 10 &&
        urlTemporaria.includes("http")
      ) {
        setFoto(null);
        setPreviewFoto(urlTemporaria);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [urlTemporaria]);

  return (
    <Dialog open={aberto} onOpenChange={handleFechar}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl">Criar Publicação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Título */}
          <div className="space-y-2.5">
            <Label htmlFor="titulo" className="text-sm">
              Título
            </Label>
            <Input
              id="titulo"
              placeholder="Dê um título para sua publicação"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="bg-input-background border-border/50 h-11 text-base text-black" 
              required
              maxLength={70}
            />
            {titulo.length > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                {titulo.length}/70
              </p>
            )}
          </div>

          {/* Conteúdo */}
          <div className="space-y-2.5">
            <Label htmlFor="descricao" className="text-sm">
              Conteúdo
            </Label>
            <Textarea
              id="descricao"
              placeholder="Compartilhe suas ideias..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[160px] resize-none bg-input-background border-border/50  text-black"
              required
              maxLength={255}
            />
            {descricao.length > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                {descricao.length}/255
              </p>
            )}
          </div>

          {/* Imagem */}
          <div className="space-y-2.5">
            <Label htmlFor="foto" className="text-sm">
              Imagem de Capa
            </Label>
            {!previewFoto ? (
              <div className="border-2 border-dashed border-border/70 rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all">
                <ImagePlus className="h-14 w-14 mx-auto text-muted-foreground/60 mb-4" />
                <div className="flex gap-2 max-w-lg mx-auto">
                  <Input
                    id="foto"
                    type="url"
                    placeholder="Cole ou digite a URL da imagem"
                    value={urlTemporaria}
                    onChange={(e) => setUrlTemporaria(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleCarregarPreview}
                    disabled={!urlTemporaria.trim()}
                    size="lg"
                    className="bg-primary hover:bg-secondary px-5"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-sm">
                <div className="relative aspect-video">
                  <img
                    src={previewFoto}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setPreviewFoto("");
                      setFoto(null);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 shadow-lg"
                  onClick={handleRemoverFoto}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="p-3 bg-background/98 backdrop-blur border-t border-border/50">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCarregarPreview}
                      disabled={!urlTemporaria.trim()}
                      className="bg-primary hover:bg-secondary"
                    >
                      <Image className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleFechar}
              className="border-border/50 h-11 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-secondary h-11 px-8"
              disabled={!titulo.trim() || !descricao.trim() || !foto}
            >
              <Send className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
