import { useState } from "react";
import { Publicacao } from "../types";
import { PostCard } from "./PostCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter, TrendingUp, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BlogHomeProps {
  publicacoes: Publicacao[];
  onVerPost?: (id: number) => void;
}

export function BlogHome({ publicacoes, onVerPost }: BlogHomeProps) {
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("recente");

  const publicacoesFiltradas = publicacoes
    .filter(pub =>
      pub.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      pub.descricao.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenacao === "recente") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar publicações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recente">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Mais recentes
                </div>
              </SelectItem>
              <SelectItem value="antigo">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Mais antigas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {publicacoesFiltradas.length} {publicacoesFiltradas.length === 1 ? "publicação encontrada" : "publicações encontradas"}
          </p>
        </div>
      </div>

      {publicacoesFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicacoesFiltradas.map((publicacao) => (
            <PostCard
              key={publicacao.id}
              publicacao={publicacao}
              onVerMais={onVerPost}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3>Nenhuma publicação encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou filtros
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setBusca("")}
            className="mt-4"
          >
            Limpar busca
          </Button>
        </div>
      )}
    </div>
  );
}
