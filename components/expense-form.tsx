"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories, createExpense } from "@/lib/api";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/database.types";

export function ExpenseForm() {
  const [amountCents, setAmountCents] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      // Set default category (Transporte)
      const defaultCat = data.find((c) => c.is_default);
      if (defaultCat) {
        setSelectedCategory(defaultCat.id);
      } else if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountCents === 0 || !selectedCategory) return;

    setIsLoading(true);
    try {
      await createExpense(amountCents, selectedCategory);

      // Show success feedback
      setIsSuccess(true);
      setAmountCents(0);

      // Reset success state after animation
      setTimeout(() => setIsSuccess(false), 1000);
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Error al guardar el gasto");
    } finally {
      setIsLoading(false);
    }
  };

  // Estilo bancario: solo números, "1" = 0.01, "100" = 1.00
  const handleAmountChange = (value: string) => {
    // Solo permitir números
    const numbers = value.replace(/\D/g, "");
    if (numbers === "") {
      setAmountCents(0);
      return;
    }
    // Convertir a número (cada dígito es un centavo)
    const cents = parseInt(numbers, 10);
    setAmountCents(cents);
  };

  // Formatear para mostrar: centavos -> S/ X.XX
  const formatDisplayAmount = (cents: number): string => {
    if (cents === 0) return "";
    const soles = cents / 100;
    return soles.toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 p-6">
      {/* Input de monto - ultra minimalista */}
      <div className="relative">
        <Input
          id="amount"
          type="text"
          inputMode="numeric"
          placeholder="0.00"
          value={formatDisplayAmount(amountCents)}
          onChange={(e) => handleAmountChange(e.target.value)}
          disabled={isLoading}
          className="text-6xl h-24 text-center font-bold tracking-tight border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 caret-transparent"
          autoFocus
        />
      </div>

      {/* Grid de categorías con íconos */}
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              disabled={isLoading}
              className={`
                flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                    : "bg-card/50 hover:bg-card hover:scale-105"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full px-0.5">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botón guardar - minimalista */}
      <Button
        type="submit"
        className="w-full h-14 text-base rounded-full"
        disabled={isLoading || amountCents === 0 || !selectedCategory}
      >
        {isLoading ? "..." : isSuccess ? "✓" : "Guardar"}
      </Button>
    </form>
  );
}
