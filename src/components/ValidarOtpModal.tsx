import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, AlertCircle } from "lucide-react";

interface ValidarOtpModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onValidarOtp: (codigo: string, token: string) => void;
  onReenviar: () => void;
  token: string;
}

export function ValidarOtpModal({ open, email, token, onClose, onValidarOtp, onReenviar }: ValidarOtpModalProps) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if(codigo.length === 6){
      onValidarOtp(codigo, token);
      setCodigo("");
    }
  };

  const handleReenviar = () => {
    setCodigo("");
    setErro("");
    onReenviar();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Verificar Código
          </DialogTitle>
          <DialogDescription>
            Enviamos um código de 6 dígitos para <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Verificação</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="000000"
                value={codigo}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCodigo(valor);
                  setErro("");
                }}
                className="bg-input-background text-center text-2xl tracking-widest text-black"
                maxLength={6}
                required
              />
              {erro && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {erro}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleReenviar}
                className="text-sm text-primary hover:underline"
              >
                Não recebeu o código? Reenviar
              </button>
            </div>
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
              disabled={codigo.length !== 6}
            >
              Verificar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
