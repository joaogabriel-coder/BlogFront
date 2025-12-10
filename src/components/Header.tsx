import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "./UserProfile";
import { Usuario } from "../types";
import { Button } from "./ui/button";
import { BookOpen, Heart, User } from "lucide-react";

interface HeaderProps {
  usuarioAtual: Usuario;
  paginaAtual: "home" | "favoritos" | "perfil";
  onNavigate?: (pagina: "home" | "favoritos" | "perfil") => void;
}

export function Header({ usuarioAtual, paginaAtual, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.("home")}>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">MeuBlog</span>
              <span className="text-xs text-muted-foreground">Compartilhe suas ideias</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant={paginaAtual === "home" ? "default" : "ghost"}
            onClick={() => onNavigate?.("home")}
            className={paginaAtual === "home" ? "bg-primary hover:bg-primary/90" : ""}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Início
          </Button>
          <Button
            variant={paginaAtual === "favoritos" ? "default" : "ghost"}
            onClick={() => onNavigate?.("favoritos")}
            className={paginaAtual === "favoritos" ? "bg-primary hover:bg-primary/90" : ""}
          >
            <Heart className="h-4 w-4 mr-2" />
            Favoritos
          </Button>
          <Button
            variant={paginaAtual === "perfil" ? "default" : "ghost"}
            onClick={() => onNavigate?.("perfil")}
            className={paginaAtual === "perfil" ? "bg-primary hover:bg-primary/90" : ""}
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:block">
            <UserProfile usuario={usuarioAtual} tamanho="sm" />
          </div>
        </div>
      </div>

      <div className="md:hidden border-t">
        <nav className="container flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("home")}
            className={paginaAtual === "home" ? "text-primary" : ""}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("favoritos")}
            className={paginaAtual === "favoritos" ? "text-primary" : ""}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("perfil")}
            className={paginaAtual === "perfil" ? "text-primary" : ""}
          >
            <User className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
