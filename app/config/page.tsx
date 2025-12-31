"use client";

import { NavFooter } from "@/components/nav-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Config() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Botón volver */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 h-10 w-10 rounded-full z-50"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <main className="flex flex-col items-center justify-center p-8 pt-16">
        <div className="w-full max-w-lg space-y-4">
          <h1 className="text-2xl font-bold text-center">Configuración</h1>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Próximamente: configuración de categorías y límite mensual
            </p>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </main>
      <NavFooter />
      <ThemeToggle />
    </div>
  );
}
