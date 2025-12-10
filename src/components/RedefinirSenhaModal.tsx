import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, Check, AlertCircle } from "lucide-react";

interface RedefinirSenhaModalProps {
  open: boolean;
  email: string
  token: string
  onClose: () => void;
  onRedefinirSenha: (novaSenha: string, token: string) => void;
}

export function RedefinirSenhaModal({ open, email, token,  onClose, onRedefinirSenha }: RedefinirSenhaModalProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const validarSenha = (senha: string) => {
    return {
      tamanho: senha.length >= 6,
      maiuscula: /[A-Z]/.test(senha),
      numero: /[0-9]/.test(senha)
    };
  };

  const validacao = validarSenha(novaSenha);
  const senhasCoinciden = novaSenha === confirmarSenha && novaSenha.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!validacao.tamanho || !validacao.maiuscula || !validacao.numero) {
      setErro("A senha não atende aos requisitos de segurança");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    onRedefinirSenha(novaSenha, token);
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border ">
        <DialogHeader>
          <DialogTitle>Criar Nova Senha</DialogTitle>
          <DialogDescription>
            Digite sua nova senha e confirme para redefinir
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="novaSenha"
                  type="password"
                  placeholder="••••••••"
                  value={novaSenha}
                  onChange={(e) => {
                    setNovaSenha(e.target.value);
                    setErro("");
                  }}
                  className="pl-10 bg-input-background text-black "
                  required
                />
              </div>

              {novaSenha && (
                <div className="space-y-1 text-xs mt-2 pl-1">
                  <div className={`flex items-center gap-1.5 ${validacao.tamanho ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${validacao.tamanho ? "opacity-100" : "opacity-30"}`} />
                    Mínimo de 6 caracteres
                  </div>
                  <div className={`flex items-center gap-1.5 ${validacao.maiuscula ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${validacao.maiuscula ? "opacity-100" : "opacity-30"}`} />
                    Pelo menos uma letra maiúscula
                  </div>
                  <div className={`flex items-center gap-1.5 ${validacao.numero ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${validacao.numero ? "opacity-100" : "opacity-30"}`} />
                    Pelo menos um número
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => {
                    setConfirmarSenha(e.target.value);
                    setErro("");
                  }}
                  className="pl-10 bg-input-background text-black"
                  required
                />
              </div>

              {confirmarSenha && (
                <div className={`text-xs flex items-center gap-1.5 mt-2 pl-1 ${senhasCoinciden ? "text-green-600" : "text-destructive"}`}>
                  <Check className={`h-3 w-3 ${senhasCoinciden ? "opacity-100" : "opacity-30"}`} />
                  {senhasCoinciden ? "Senhas coincidem" : "Senhas não coincidem"}
                </div>
              )}
            </div>

            {erro && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{erro}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-secondary"
              disabled={!novaSenha || !confirmarSenha || !senhasCoinciden}
            >
              Redefinir Senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
