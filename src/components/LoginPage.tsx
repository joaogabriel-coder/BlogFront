import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BookOpen, Mail, Lock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Api from "@/Config/Api";
import axios from "axios";

interface LoginPageProps {
  onLogin: (data: { token: string; usuario: any }) => void;
  onNavigateToCadastro: () => void;
}

export function LoginPage({ onLogin, onNavigateToCadastro }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
  if (!email || !senha) return;

  try {
    const response = await Api.post("/api/login", { email, password: senha });
    const data = response.data; // { token, usuario }

    if (!data || !data.token || !data.usuario) {
      setErro("Resposta inválida do servidor");
      return;
    }

    onLogin(data);
  } catch (error: any) {
    console.error("Erro no login:", error);
    setErro("Email ou senha incorretos");
  }
};



  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Lado Esquerdo - Branding */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary/80 p-8 lg:p-12 flex flex-col justify-center min-h-[40vh] lg:min-h-screen">
        {/* Conteúdo Central */}
        <div className="flex-1 flex items-center justify-center z-10 py-8 px-4">
          <div className="max-w-lg w-full text-center space-y-8">
            {/* Logo Principal */}
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Título Principal */}
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl text-white tracking-tight">
                Escreva.
                <br />
                Compartilhe.
                <br />
                Inspire.
              </h2>
            </div>

            {/* Elementos Decorativos */}
            <div className="flex items-center justify-center gap-4 text-white/60">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-sm tracking-widest uppercase">Blog</span>
              <div className="h-px w-12 bg-white/40" />
            </div>
          </div>
        </div>

        {/* Gradiente Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-secondary/50 pointer-events-none" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {erro && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm dark:bg-red-900/50 dark:text-red-300">
                🚨 {erro}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email ou Usuário
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input-background border-border h-12 text-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 bg-input-background border-border h-12 text-black"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-secondary h-12 text-base"
              disabled={!email || !senha}
            >
              ENTRAR
            </Button>
          </form>

          {/* Link para Cadastro */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Ainda não tem conta? </span>
            <button
              type="button"
              onClick={onNavigateToCadastro}
              className="text-primary hover:underline"
            >
              CRIAR CONTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
