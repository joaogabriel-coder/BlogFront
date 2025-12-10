import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "./UserProfile";
import { Usuario } from "../types";
import { Button } from "./ui/button";
import { BookOpen, Heart, User, Home, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavBarProps {
  usuarioAtual: Usuario;
  paginaAtual: "feed" | "perfil";
  onNavigate?: (pagina: "feed" | "perfil") => void;
  onLogout?: () => void;
}

export function NavBar({ usuarioAtual, paginaAtual, onNavigate, onLogout }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.("feed")}>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">MeuBlog</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Compartilhe suas ideias
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant={paginaAtual === "feed" ? "default" : "ghost"}
            onClick={() => onNavigate?.("feed")}
            className={paginaAtual === "feed" ? "bg-primary hover:bg-secondary" : "hover:bg-accent"}
          >
            <Home className="h-4 w-4 mr-2" />
            Início
          </Button>
          <Button
            variant={paginaAtual === "perfil" ? "default" : "ghost"}
            onClick={() => onNavigate?.("perfil")}
            className={paginaAtual === "perfil" ? "bg-primary hover:bg-secondary" : "hover:bg-accent"}
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-accent">
                <UserProfile usuario={usuarioAtual} tamanho="sm" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => onNavigate?.("perfil")}
                className="cursor-pointer hover:bg-accent"
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="md:hidden hover:bg-accent"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="md:hidden border-t border-border bg-background">
        <nav className="container flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("feed")}
            className={paginaAtual === "feed" ? "text-primary" : ""}
          >
            <Home className="h-5 w-5" />
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
