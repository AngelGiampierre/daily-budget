"use client";

const AUTH_KEY = "expense-tracker-auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(password: string): boolean {
  const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;
  if (password === correctPassword) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}
