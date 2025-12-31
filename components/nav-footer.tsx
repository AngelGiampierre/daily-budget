"use client";

import { BarChart3, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NavFooter() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Dashboard */}
      <Button
        size="icon"
        onClick={() => router.push("/dashboard")}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${
          pathname === "/dashboard"
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105"
        }`}
      >
        <BarChart3 className="h-6 w-6" />
      </Button>

      {/* Config */}
      <Button
        size="icon"
        onClick={() => router.push("/config")}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${
          pathname === "/config"
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105"
        }`}
      >
        <Settings className="h-6 w-6" />
      </Button>
    </div>
  );
}
