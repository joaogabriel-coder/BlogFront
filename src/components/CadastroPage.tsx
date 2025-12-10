import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BookOpen, Mail, Lock, User, Check } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Api from "@/Config/Api";
import { Usuario } from "@/types";


interface CadastroPageProps {
  onCriarConta: (nome: string, email: string, senha: string) => void;
  onNavigateToLogin: () => void;
}

export function CadastroPage({
  onCriarConta,
  onNavigateToLogin,
}: CadastroPageProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const validarSenha = (senha: string) => {
    return {
      tamanho: senha.length >= 6,
      maiuscula: /[A-Z]/.test(senha),
      numero: /[0-9]/.test(senha),
    };
  };

  const validacao = validarSenha(senha);
  const senhasCoinciden = senha === confirmarSenha && senha.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Todos os campos são obrigatórios");
      return;
    }

    if (!validacao.tamanho || !validacao.maiuscula || !validacao.numero) {
      setErro("A senha não atende aos requisitos de segurança");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try{
      const usuario = await cadastrarUsuario(nome, email, senha);
      console.log("Usuario cadastrado", usuario);
    }catch(arror){
      setErro("Erro")
    }
  };


  async function cadastrarUsuario(nome: string, email: string, senha: string) {
    setErro(null);
    if (!nome || !email || !senha) {
        setErro("Todos os campos são obrigatórios.");
        return;
    }
    try{
      const response = await Api.post("/api/usuarios", {
        nome,
        email,
        password: senha,
      });

      onNavigateToLogin();
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar o usuario", error.response?.data);
      const serverMessage = error.response.data.message || error.response.data.email?.[0];
              if (serverMessage && serverMessage.toLowerCase().includes('email já cadastrado') 
                || error.response.status === 409 
                || (error.response.status === 400 && serverMessage)) {
                setErro("Email já cadastrado");
                return;
            }
      setErro("Email já cadastrado");
      return;
    }
  }

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
                Sua voz.
                <br />
                Sua história.
                <br />
                Seu blog.
              </h2>
            </div>

            {/* Elementos Decorativos */}
            <div className="flex items-center justify-center gap-4 text-white/60">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-sm tracking-widest uppercase">Criar</span>
              <div className="h-px w-12 bg-white/40" />
            </div>
          </div>
        </div>

        {/* Gradiente Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-secondary/50 pointer-events-none" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background relative overflow-y-auto">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl">Criar Nova Conta</h1>
            <p className="text-muted-foreground">
              Preencha seus dados para começar
            </p>
          </div>
          {erro && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm dark:bg-red-900/50 dark:text-red-300">
                🚨 {erro}
              </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10 bg-input-background border-border h-12 text-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
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

                {senha && (
                  <div className="space-y-1 text-xs mt-2 pl-1">
                    <div
                      className={`flex items-center gap-1.5 ${
                        validacao.tamanho
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 ${
                          validacao.tamanho ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      Mínimo de 6 caracteres
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        validacao.maiuscula
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 ${
                          validacao.maiuscula ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      Pelo menos uma letra maiúscula
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        validacao.numero
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 ${
                          validacao.numero ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      Pelo menos um número
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha" className="text-sm">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10 bg-input-background border-border h-12 text-black"
                    required
                  />
                </div>

                {confirmarSenha && (
                  <div
                    className={`text-xs flex items-center gap-1.5 mt-2 pl-1 ${
                      senhasCoinciden ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 ${
                        senhasCoinciden ? "opacity-100" : "opacity-30"
                      }`}
                    />
                    {senhasCoinciden
                      ? "Senhas coincidem"
                      : "Senhas não coincidem"}
                  </div>
                )}
              </div>

              {erro && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{erro}</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-secondary h-12 text-base"
              disabled={
                !nome || !email || !senha || !confirmarSenha || !senhasCoinciden
              }
            >
              CRIAR CONTA
            </Button>
          </form>

          {/* Link para Login */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já possui uma conta? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-primary hover:underline"
            >
              FAZER LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
