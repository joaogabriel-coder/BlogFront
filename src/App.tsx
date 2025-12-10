import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { CadastroPage } from "./components/CadastroPage";
import { NavBar } from "./components/NavBar";
import { BlogFeed } from "./components/BlogFeed";
import { PostDetailPage } from "./components/PostDetailPage";
import { PerfilPage } from "./components/PerfilPage";
import { PerfilUsuarioPage } from "./components/PerfilUsuarioPage";
import { CriarPublicacaoModal } from "./components/CriarPublicacaoModal";
import { EditarPublicacaoModal } from "./components/EditarPublicacaoModal";
import { Usuario, Publicacao, Comentario, Favorito } from "./types";
import { useEffect } from "react";
import Api from "./Config/Api";


type Pagina =
  | "login"
  | "cadastro"
  | "feed"
  | "perfil"
  | "post"
  | "perfil-usuario";

function App() {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [paginaAtual, setPaginaAtual] = useState<Pagina>("login");
  const [postSelecionado, setPostSelecionado] = useState<number | null>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(
    null
  );
  const [publicacaoEmDetalhe, setPublicacaoEmDetalhe] =
    useState<Publicacao | null>(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [publicacaoEditando, setPublicacaoEditando] =
    useState<Publicacao | null>(null);

  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  
  useEffect(() => {
    
    const usuarioSalvo = localStorage.getItem("usuario");
    const tokenSalvo = localStorage.getItem("token"); 
    
    const usuarioValido = usuarioSalvo && usuarioSalvo !== "undefined" && usuarioSalvo !== "null";
    const tokenValido = tokenSalvo && tokenSalvo !== "undefined" && tokenSalvo !== "null";


    if (usuarioValido && tokenValido) {
  
      setUsuarioAtual(JSON.parse(usuarioSalvo!)); 
  
      Api.defaults.headers.common["Authorization"] = `Bearer ${tokenSalvo}`;
  
      carregarDados();
      setPaginaAtual("feed");
    } else {

      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      
      setPaginaAtual("login");
    }
  }, []);

  async function carregarDados() {
    try {
    const pubRes = await Api.get("/api/publicacoes");
    const comRes = await Api.get("/api/comentarios");
    const favRes = await Api.get("/api/favoritos");

    const publicacoesFormatadas = pubRes.data.map((p: any) => ({
      ...p,
      usuarioId: p.usuario_id ? Number(p.usuario_id) : p.usuarioId,
      foto: p.foto_url || p.foto 
    }));

    setPublicacoes(publicacoesFormatadas); 
    setComentarios(comRes.data);
    setFavoritos(favRes.data);
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    handleLogout();
  }
  }

  function handleLogin(data: { token: string; usuario: any }) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  Api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

  setUsuarioAtual(data.usuario);

  carregarDados();
  setPaginaAtual("feed");
  }

  const handleCriarConta = async (
    nome: string,
    email: string,
    senha: string
  ) => {

    console.log("Criar conta:", { nome, email, senha });
  };

  const handleLogout = async () => {
    try{
      await Api.post("/api/logout");
      console.log("Logout realizado com sucesso")

      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      delete Api.defaults.headers.common["Authorization"];
      setUsuarioAtual(null);
        setPaginaAtual("login");
        setPostSelecionado(null);
    }catch(error){
      console.error("Erro ao fazer logout no servidor, mas limpando o cliente.", error);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token"); 
    delete Api.defaults.headers.common["Authorization"];
    setUsuarioAtual(null);
    setPaginaAtual("login");
    setPostSelecionado(null);
    }
  };

  const handleNavigate = (pagina: "feed" | "perfil") => {
    setPaginaAtual(pagina);
    setPostSelecionado(null);
  };

  const handleVerPost = async (id: number) => {
    console.log("CLIQUE RECEBIDO. ID:", id);
    setPostSelecionado(id);
    setPaginaAtual("post");
    setPublicacaoEmDetalhe(null)
    try {
      console.log("Iniciando a Api")
        const responsePublicacao = await Api.get(`/api/publicacoes/${id}`);
        const responseComentarios = await Api.get(
            `/api/comentarios?publicacaoId=${id}`
        );

        let dadosPublicacao = responsePublicacao.data;

        if (dadosPublicacao.usuario_id) {
            dadosPublicacao.usuarioId = Number(dadosPublicacao.usuario_id); 
        }

        if(dadosPublicacao.foto_url){
          dadosPublicacao.foto = dadosPublicacao.foto_url;
        }

        setComentarios(responseComentarios.data);
        setPublicacaoEmDetalhe(dadosPublicacao); 
        
        // ...
        setPublicacoes((prev) =>
            prev.map((p) => (p.id === id ? dadosPublicacao : p))
        );
    } catch (error) {
      console.error("Erro ao carregar os detalhes da publicação:", error);
    setPaginaAtual("feed");
    }
};

  const handleVoltar = () => {
    setPostSelecionado(null);
    setUsuarioSelecionado(null);
    setPaginaAtual("feed");
  };

  const handleVerPerfilUsuario = (usuarioId: number) => {
    setUsuarioSelecionado(usuarioId);
    setPaginaAtual("perfil-usuario");
  };

  async function handlePostar(titulo: string, descricao: string, foto: File) {
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("foto", foto);

      const response = await Api.post("/api/publicacoes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Publicação enviada", response.data);
      // atualizar feed
      carregarDados();
    } catch (e) {
      console.error("Erro ao postar publicação:", e);
    }
  }

  const handleAbrirEdicao = (id: number) => {
    // TODO: GET /publicacoes/:id
    console.log("Abrir edição:", id);
    const publicacao = publicacoes.find((p) => p.id === id);
    if (publicacao) {
      setPublicacaoEditando(publicacao);
      setModalEditarAberto(true);
    }
  };

  const handleEditarPublicacao = async (
    id: number,
    titulo: string,
    descricao: string
  ) => {
    // TODO: PUT /publicacoes/:id
    console.log("Editar publicação:", { id, titulo, descricao });

    await Api.put(`/api/publicacoes/${id}`, {id, titulo, descricao})

    setModalEditarAberto(false);
    setPublicacaoEditando(null);
  };

  const handleApagarPublicacao = async (id: number) => {
    console.log("Apagar publicação:", id);
    try{
      await Api.delete(`/api/publicacoes/${id}`);

      setPublicacoes(prev=>prev.filter(p=>p.id !== id));
      handleVoltar();
    }catch(error){ 
      console.error("Erro ao apagar publicação:", error);
    }
  };


  const handleEditarComentario = async (id: number, texto: string) => {
    console.log("Editar comentário:", { id, texto });
    try {
        await Api.put(`/api/comentarios/${id}`, { texto: texto });
        
        setComentarios((prev) => 
            prev.map((c) => (c.id === id ? { ...c, texto: texto } : c))
        );

        setPublicacaoEmDetalhe((prevPublicacao) => {
            if (!prevPublicacao) return null;
            
            return {
                ...prevPublicacao,
                comentarios: prevPublicacao.comentarios.map((c) => 
                    c.id === id ? { ...c, texto: texto } : c
                ),
            };
        });

    } catch (error) {
        console.error("Erro ao editar comentário:", error); 
    }
  };

 const handleAdicionarNovoComentario = async (novoComentario: Comentario) => {
    
    setComentarios((prev) => [...prev, novoComentario]);
    
    setPublicacaoEmDetalhe((prevPublicacao) => {
        if (!prevPublicacao) return null;
        
        const comentariosAtuais = prevPublicacao.comentarios || []; 

        return {
            ...prevPublicacao,
            comentarios: [...comentariosAtuais, novoComentario], 
        };
    });
};
  const handleApagarComentario = async (id: number) => {
    try {
        await Api.delete(`/api/comentarios/${id}`);
        setComentarios((prev) => prev.filter((c) => c.id !== id));
        setPublicacaoEmDetalhe((prevPublicacao) => {
            if (!prevPublicacao) return null;
            const comentariosAtualizados = prevPublicacao.comentarios.filter(
                (c) => c.id !== id
            );
            return {
                ...prevPublicacao,
                comentarios: comentariosAtualizados,
            };
        });
        console.log(`Comentário ${id} apagado com sucesso.`);
    } catch (error) {
        console.error("Erro ao apagar comentário:", error);
    }
};

  const handleToggleFavorito = async (publicacaoId: number) => {
    if (!usuarioAtual || publicacaoEmDetalhe?.id !== publicacaoId) return;

    const favoritoExistente = publicacaoEmDetalhe.favoritos.find(
        (f) => f.usuario_id === usuarioAtual.id 
    );
    try {
        if (favoritoExistente) {
            await Api.delete(`/api/favoritos/${favoritoExistente.id}`);
          
            setPublicacaoEmDetalhe((prevPublicacao) => {
                const prev = prevPublicacao as Publicacao; 
                return {
                    ...prev,
                    favoritos_count: (prev.favoritos_count ?? 0) - 1, 
                    favoritos: prev.favoritos.filter(f => f.id !== favoritoExistente.id)
                };
            });
            
        } else {
            const response = await Api.post("/api/favoritos", {
                publicacao_id: publicacaoId
            });
            
            setPublicacaoEmDetalhe((prevPublicacao) => {
                const prev = prevPublicacao as Publicacao;
                return {
                    ...prev,
                    favoritos_count: (prev.favoritos_count ?? 0) + 1,
                    favoritos: [...prev.favoritos, response.data] 
                };
            });
        }
        
    } catch (error) {
        console.error("Erro ao alternar favorito:", error);
    }
  };


  const handleEditarConta = async (nome: string, email: string) => {
    if(!usuarioAtual) return;
    try{
      const response  = await Api.put(`/api/usuarios/${usuarioAtual.id}`, {nome: nome, email: email});
      setUsuarioAtual(response.data.usuario);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
    }catch(error){
      console.error("Erro ao Editar Conta: ", error);
    }
  };

  const handleExcluirConta = async () => {
    if(!usuarioAtual) return;
    try{
      const response = await Api.delete(`/api/usuarios/${usuarioAtual.id}`);
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      delete Api.defaults.headers.common["Authorization"];
      setUsuarioAtual(null);
        setPaginaAtual("login");
        setPostSelecionado(null);
      console.log("Usuario deletado com sucesso", response.data)
    }catch(error){
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      delete Api.defaults.headers.common["Authorization"];
      setUsuarioAtual(null);
        setPaginaAtual("login");
        setPostSelecionado(null);
    }
  };

  // === RENDERIZAÇÃO ===

  const publicacaoAtual = postSelecionado
    ? publicacoes.find((p) => p.id === postSelecionado)
    : null;

  const usuarioParaVisualizar = usuarioSelecionado
    ? null // TODO: GET /usuarios/:id
    : null;

  if (paginaAtual === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToCadastro={() => setPaginaAtual("cadastro")}
      />
    );
  }

  if (paginaAtual === "cadastro") {
    return (
      <CadastroPage
        onCriarConta={handleCriarConta}
        onNavigateToLogin={() => setPaginaAtual("login")}
      />
    );
  }
  if (!usuarioAtual) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToCadastro={() => setPaginaAtual("cadastro")}
      />
    );
  }

  const publicacaoEstaFavoritada = publicacaoEmDetalhe?.favoritos?.some(
    (f) => f.usuario_id === usuarioAtual?.id 
) ?? false;
  
  const totalFavoritosInicial = publicacaoEmDetalhe?.favoritos_count ?? 0;
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <NavBar
        usuarioAtual={usuarioAtual}
        paginaAtual={
          paginaAtual === "post" || paginaAtual === "perfil-usuario"
            ? "feed"
            : paginaAtual
        }
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="container py-8">
        {paginaAtual === "feed" && (
          <BlogFeed
            publicacoes={publicacoes}
            comentarios={comentarios}
            favoritos={favoritos}
            usuarioAtual={usuarioAtual}
            onVerPost={handleVerPost}
            onCriarPublicacao={() => setModalCriarAberto(true)}
            onToggleFavorito={handleToggleFavorito}
            onVerPerfilUsuario={handleVerPerfilUsuario}
          />
        )}

        {paginaAtual === "post" && publicacaoEmDetalhe && usuarioAtual && (
          <PostDetailPage
            publicacao={publicacaoEmDetalhe}
            isFavoritoInicial={publicacaoEstaFavoritada}
            totalFavoritosInicial={totalFavoritosInicial}
            comentarios={comentarios}
            usuarioAtual={usuarioAtual}
            onVoltar={handleVoltar}
            onToggleFavorito={handleToggleFavorito}
            onAdicionarComentario={handleAdicionarNovoComentario}
            onEditarComentario={handleEditarComentario}
            onApagarComentario={handleApagarComentario}
            onEditarPublicacao={handleAbrirEdicao}
            onApagarPublicacao={handleApagarPublicacao}
            onVerPerfilUsuario={handleVerPerfilUsuario}
          />
        )}

        {paginaAtual === "perfil" && (
          <PerfilPage
            usuarioAtual={usuarioAtual}
            publicacoes={publicacoes}
            favoritos={favoritos}
            onVerPost={handleVerPost}
            onEditarConta={handleEditarConta}
            onExcluirConta={handleExcluirConta}
            onLogout={handleLogout}
            onMudarPagina={setPaginaAtual}
          />
        )}

        {paginaAtual === "perfil-usuario" && usuarioParaVisualizar && (
          <PerfilUsuarioPage
            usuario={usuarioParaVisualizar}
            publicacoes={publicacoes}
            comentarios={comentarios}
            favoritos={favoritos}
            usuarioAtual={usuarioAtual}
            onVoltar={handleVoltar}
            onVerPost={handleVerPost}
            onToggleFavorito={handleToggleFavorito}
            onAdicionarComentario={handleAdicionarNovoComentario}
          />
        )}
      </main>

      <CriarPublicacaoModal
        aberto={modalCriarAberto}
        onFechar={() => setModalCriarAberto(false)}
        onPostar={handlePostar}
      />

      <EditarPublicacaoModal
        aberto={modalEditarAberto}
        publicacao={publicacaoEditando}
        onFechar={() => {
          setModalEditarAberto(false);
          setPublicacaoEditando(null);
        }}
        onEditar={handleEditarPublicacao}
      />
    </div>
  );
}

export default App;
