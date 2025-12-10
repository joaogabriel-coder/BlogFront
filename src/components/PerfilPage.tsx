import { useState } from "react";
import { Usuario, Publicacao, Favorito } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Heart, FileText, User, Mail, Edit2, Trash2, Save, X, LogOut, KeyRound } from "lucide-react";
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
import { SolicitarOtpModal } from "./SolicitarOtpModal";
import { ValidarOtpModal } from "./ValidarOtpModal";
import { RedefinirSenhaModal } from "./RedefinirSenhaModal";
import { toast } from "sonner";
import Api from "@/Config/Api";
type Pagina =
  | "login"
  | "cadastro"
  | "feed"
  | "perfil"
  | "post"
  | "perfil-usuario";

interface PerfilPageProps {
  usuarioAtual: Usuario;
  publicacoes: Publicacao[];
  favoritos: Favorito[];
  onVerPost?: (id: number) => void;
  onEditarConta?: (nome: string, email: string) => void;
  onExcluirConta?: () => void;
  onLogout?: () => void;
  onMudarPagina: (pagina: Pagina) => void;
}

export function PerfilPage({
  usuarioAtual,
  publicacoes,
  favoritos,
  onVerPost,
  onEditarConta,
  onExcluirConta,
  onLogout,
  onMudarPagina
}: PerfilPageProps) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuarioAtual.nome);
  const [email, setEmail] = useState(usuarioAtual.email);
  const [mostrarDialogoExcluir, setMostrarDialogoExcluir] = useState(false);

  // Estados para redefinição de senha
  const [mostrarSolicitarOtp, setMostrarSolicitarOtp] = useState(false);
  const [mostrarValidarOtp, setMostrarValidarOtp] = useState(false);
  const [mostrarRedefinirSenha, setMostrarRedefinirSenha] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const [tokenRedefinicao, setTokenRedefinicao] = useState(""); 
  

  const minhasPublicacoes = publicacoes.filter(p => p.usuario_id === usuarioAtual.id);
  const publicacoesFavoritas = publicacoes.filter(p =>
    favoritos.some(f => f.publicacao_id === p.id && f.usuario_id === usuarioAtual.id)
  );

  const handleSalvarEdicao = async () => {
    const dadosAlterados = nome !== usuarioAtual.nome || email !== usuarioAtual.email;
    if (!dadosAlterados) {
        setEditando(false);
        return;
    }

    if (!nome.trim() || !email.trim()) {
        toast.error("Nome e Email não podem estar vazios.");
        return;
    }
    onEditarConta?.(nome, email);
    setEditando(false);
    
    toast.success("Perfil atualizado! (Requer implementação completa no App.tsx)");
  };

  const handleCancelarEdicao = () => {
    setNome(usuarioAtual.nome);
    setEmail(usuarioAtual.email);
    setEditando(false);
  };

  const handleConfirmarExclusao = () => {
    onExcluirConta?.();
    setMostrarDialogoExcluir(false);
  };

  // Funções de redefinição de senha
  const handleEnviarOtp = async (email: string) => {
    setEmailRecuperacao(email);

    try {
        const endpoint = "/api/password/solicitar-reset"; 
        console.log("Chamando a API:", endpoint);

        const response = await Api.post(endpoint, { 
            email: email 
        });
         
        const novoToken = response.data.token;
        setTokenRedefinicao(novoToken); 
        
        toast.success(`Código enviado para ${email}!`, {
            description: "Verifique sua caixa de entrada.",
        });
        
        setMostrarSolicitarOtp(false); 
        setMostrarValidarOtp(true);    
        
    } catch (error) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || `Falha de rede (${status || 'Sem resposta'}). Verifique se o servidor está rodando.`;
        
        toast.error(errorMessage);
        setMostrarSolicitarOtp(true); 
    }
  };

  const handleValidarOtp = async (codigo: string, token: string) => {
    if(!emailRecuperacao){
      toast.error("Error: Email de recuperação não encontrado. Recomece o processo");
      return;
    }
    try{
      const endpoint = '/api/verificacao/verificar-otp';

      const response = await Api.post(endpoint, {
        email: emailRecuperacao,
        otp_code: codigo,
        token: token
      })
      console.log("Validação OTP bem-sucedida. Resposta:", response.data);

      setMostrarValidarOtp(false);
      setMostrarRedefinirSenha(true);
    }catch(error){
        console.log("Error ao validar OTP", error);

        const errorMessage = error.response?.data?.message || "Erro na validação. Código ou Token inválido.";
        toast.error(errorMessage);

        setMostrarValidarOtp(true);
    }
  };

  const handleReenviarOtp =  () => {
    // Mock: Simular reenvio (backend fará isso futuramente)
    toast.success("Novo código enviado!", {
      description: "Verifique sua caixa de entrada"
    });
  };

  const handleRedefinirSenha = async (novaSenha: string, token: string) => {
    if (!emailRecuperacao) {
        toast.error("Erro: Email de recuperação não encontrado. Recomece o processo.");
        return;
    }

    try{
      const endpoint = '/api/password/redefinir';

      const response = await Api.post(endpoint, {
        email: emailRecuperacao,
        nova_senha: novaSenha,
        senha_confirmation: novaSenha,
        token: token
      })

      toast.success("Senha redefinida com sucesso! Por favor, faça login com a nova senha.");
      handleCancelarFluxoOtp();
      onMudarPagina("login")
    }catch(error){
      const errorMessage = error.response?.data?.message || "Falha na redefinição. Tente o processo novamente.";
      toast.error(errorMessage);
      setMostrarRedefinirSenha(true);
    }   
  };

  const handleCancelarFluxoOtp = () => {
    setMostrarSolicitarOtp(false);
    setMostrarValidarOtp(false);
    setMostrarRedefinirSenha(false);
    setEmailRecuperacao("");
  };

  const handleFecharSucesso = () => {
    setMostrarSucesso(false);
    setEmailRecuperacao("");

  };

  const iniciais = usuarioAtual.nome
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border shadow-lg bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Meu Perfil</CardTitle>
            {!editando && (
              <Button
                variant="outline"
                onClick={() => setEditando(true)}
                className="border-border hover:bg-accent"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl text-primary-foreground shrink-0">
              {iniciais}
            </div>

            <div className="flex-1 space-y-4">
              {!editando ? (
                <>
                  <div className="space-y-1">
                    <h2>{usuarioAtual.nome}</h2>
                    <p className="text-muted-foreground">{usuarioAtual.email}</p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="pl-10 bg-input-background text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-input-background text-black"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSalvarEdicao}
                      className="bg-primary hover:bg-secondary"
                      disabled={!nome.trim() || !email.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelarEdicao}
                      className="border-border"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl mb-1">{minhasPublicacoes.length}</div>
              <div className="text-sm text-muted-foreground">Publicações</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl mb-1">{publicacoesFavoritas.length}</div>
              <div className="text-sm text-muted-foreground">Favoritos</div>
            </div>
          </div>

          {!editando && (
            <div className="pt-4 border-t border-border space-y-3">
              <Button
                variant="outline"
                onClick={() => setMostrarSolicitarOtp(true)}
                className="border-border hover:bg-accent w-full"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Redefinir Senha
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-border hover:bg-accent w-full"
              >
                <LogOut className="h-4 w-4 mr-2" 
                />
                Sair da Conta
              </Button>
              <Button
                variant="outline"
                onClick={() => setMostrarDialogoExcluir(true)}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="publicacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
          <TabsTrigger value="publicacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            Minhas Publicações
          </TabsTrigger>
          <TabsTrigger value="favoritos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-4 w-4 mr-2" />
            Favoritos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="publicacoes" className="space-y-4">
          {minhasPublicacoes.length > 0 ? (
            minhasPublicacoes.map(pub => (
              <Card
                key={pub.id}
                onClick={() => onVerPost?.(pub.id)}
                className="p-4 hover:bg-accent transition-colors cursor-pointer border-border"
              >
                <div className="flex gap-4">
                  <img
                    src={pub.foto}
                    alt={pub.titulo}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 break-words">{pub.titulo}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pub.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(pub.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center border-border bg-card">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <h3 className="mb-2">Nenhuma publicação ainda</h3>
              <p className="text-muted-foreground text-sm">
                Crie sua primeira publicação e compartilhe com a comunidade
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favoritos" className="space-y-4">
          {publicacoesFavoritas.length > 0 ? (
            publicacoesFavoritas.map(pub => (
              <Card
                key={pub.id}
                onClick={() => onVerPost?.(pub.id)}
                className="p-4 hover:bg-accent transition-colors cursor-pointer border-border"
              >
                <div className="flex gap-4">
                  <img
                    src={pub.foto}
                    alt={pub.titulo}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1">{pub.titulo}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pub.descricao}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Por {pub.usuario?.nome}</span>
                      <span>•</span>
                      <span>{new Date(pub.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center border-border bg-card">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <h3 className="mb-2">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground text-sm">
                Favorite publicações para vê-las aqui
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={mostrarDialogoExcluir} onOpenChange={setMostrarDialogoExcluir}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão de conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              Todas as suas publicações, comentários e favoritos serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarExclusao}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir conta permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modais de Redefinição de Senha */}
      <SolicitarOtpModal
        open={mostrarSolicitarOtp}
        onClose={handleCancelarFluxoOtp}
        onEnviarOtp={handleEnviarOtp}
      />

      <ValidarOtpModal
        open={mostrarValidarOtp}
        email={emailRecuperacao}
        token={tokenRedefinicao}
        onClose={handleCancelarFluxoOtp}
        onValidarOtp={handleValidarOtp}
        onReenviar={handleReenviarOtp}
      />

      <RedefinirSenhaModal
        open={mostrarRedefinirSenha}
        email={emailRecuperacao}
        token={tokenRedefinicao} 
        onClose={handleCancelarFluxoOtp}
        onRedefinirSenha={handleRedefinirSenha}
      />

      {/* Modal de Sucesso */}
      <AlertDialog open={mostrarSucesso} onOpenChange={setMostrarSucesso}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <KeyRound className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Senha Redefinida com Sucesso!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Sua senha foi atualizada com sucesso. Agora você pode fazer login com sua nova senha.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={handleFecharSucesso}
              className="bg-primary hover:bg-secondary w-full sm:w-auto"
            >
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
