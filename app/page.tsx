"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/login-form";
import { ExpenseForm } from "@/components/expense-form";
import { NavFooter } from "@/components/nav-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null; // Prevent flash of unauthenticated content
  }

  if (!isAuth) {
    return (
      <>
        <LoginForm onSuccess={() => setIsAuth(true)} />
        <ThemeToggle />
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-20">
      <main className="w-full max-w-lg px-4">
        <ExpenseForm />
      </main>
      <NavFooter />
      <ThemeToggle />
    </div>
  );
}
