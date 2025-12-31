import {
  Car,
  Dumbbell,
  Cookie,
  ShoppingBag,
  Film,
  Dog,
  Gift,
  HandCoins,
  LucideIcon,
} from "lucide-react";

// Mapeo de nombres de categorías a íconos
// TODO: Más adelante esto vendrá de la base de datos desde Config
export const categoryIcons: Record<string, LucideIcon> = {
  Transporte: Car,
  Deporte: Dumbbell,
  Antojo: Cookie,
  Básico: ShoppingBag,
  Entretenimiento: Film,
  Mascota: Dog,
  Detalles: Gift,
  Préstamo: HandCoins,
};

export function getCategoryIcon(categoryName: string): LucideIcon {
  return categoryIcons[categoryName] || ShoppingBag; // ShoppingBag como fallback
}
