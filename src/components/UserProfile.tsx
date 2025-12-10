import { Usuario } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserProfileProps {
  usuario: Usuario;
  tamanho?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function UserProfile({ usuario, tamanho = "md", onClick }: UserProfileProps) {
  const tamanhos = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const iniciais = usuario.nome
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
      onClick={handleClick}
    >
      <Avatar className={tamanhos[tamanho]}>
        <AvatarFallback className="bg-primary text-primary-foreground">
          {iniciais}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className={`${tamanho === "sm" ? "text-sm" : ""} ${onClick ? "hover:text-primary transition-colors" : ""}`}>
          {usuario.nome}
        </span>
        {tamanho !== "sm" && (
          <span className="text-xs text-muted-foreground">{usuario.email}</span>
        )}
      </div>
    </div>
  );
}
