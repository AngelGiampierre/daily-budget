"use client";

import { useState, useEffect } from "react";
import { NavFooter } from "@/components/nav-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getExpensesByMonth, getSettings, getCategories } from "@/lib/api";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Expense, Category } from "@/lib/database.types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState(250000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const [expensesData, settingsData, categoriesData] = await Promise.all([
        getExpensesByMonth(year, month),
        getSettings(),
        getCategories(),
      ]);

      setExpenses(expensesData);
      setMonthlyLimit(settingsData.monthly_limit);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gastos de hoy
  const getTodayExpenses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return expenses.filter((e) => {
      const expenseDate = new Date(e.created_at);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    });
  };

  // Calcular datos del gráfico de 7 días
  const getChartData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Determinar si mañana es un mes nuevo
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isNextMonthTomorrow = tomorrow.getMonth() !== currentMonth;

    // Si mañana es mes nuevo, la proyección no aplica (mes nuevo = budget resetea)
    if (isNextMonthTomorrow) {
      // Calcular gastos HASTA AYER (sin incluir hoy)
      const pastExpenses = expenses.filter((e) => {
        const expenseDate = new Date(e.created_at);
        expenseDate.setHours(0, 0, 0, 0);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        return expenseDate.getTime() < todayDate.getTime();
      });
      const pastSpentCents = pastExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Tope de hoy = todo lo que queda del mes
      const todayBudgetCents = monthlyLimit - pastSpentCents;

      const todayExpenses = getTodayExpenses();
      const todaySpentCents = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

      const data = [];

      // Hoy (último día del mes actual)
      const topeSoles = Math.floor(todayBudgetCents / 100);
      const spentSoles = Math.floor(todaySpentCents / 100);
      const remainingSoles = Math.max(0, topeSoles - spentSoles);

      data.push({
        day: 1,
        label: today.getDate().toString(),
        spent: spentSoles,
        remaining: remainingSoles,
        tope: topeSoles, // Guardar el tope original
        baseline: 0,
        projected: 0,
        isToday: true,
        isUp: false,
      });

      // Próximos 6 días (mes nuevo - baseline puro)
      const nextMonthDays = new Date(currentYear, currentMonth + 2, 0).getDate();
      const nextMonthBaselineCents = Math.floor(monthlyLimit / nextMonthDays);
      const nextMonthBaselineSoles = Math.floor(nextMonthBaselineCents / 100);

      for (let i = 1; i <= 6; i++) {
        data.push({
          day: i + 1,
          label: i.toString(),
          spent: 0,
          remaining: 0,
          baseline: nextMonthBaselineSoles,
          projected: 0,
          isToday: false,
          isUp: false,
        });
      }

      return data;
    }

    // Lógica normal: dentro del mismo mes
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = today.getDate();
    const daysRemaining = daysInMonth - dayOfMonth + 1;

    // TODO en centavos primero
    const baselineBudgetCents = Math.floor(monthlyLimit / daysInMonth);

    const pastExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.created_at);
      expenseDate.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() < todayDate.getTime();
    });
    const pastSpentCents = pastExpenses.reduce((sum, e) => sum + e.amount, 0);

    const todayExpenses = getTodayExpenses();
    const todaySpentCents = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const totalSpentCents = pastSpentCents + todaySpentCents;
    const remainingCents = monthlyLimit - totalSpentCents;
    const daysAfterToday = daysRemaining - 1;
    const projectedBudgetCents =
      daysAfterToday > 0 ? Math.floor(remainingCents / daysAfterToday) : 0;

    // Convertir a soles solo para el gráfico
    const baselineBudgetSoles = Math.floor(baselineBudgetCents / 100);
    const todaySpentSoles = Math.floor(todaySpentCents / 100);
    const remainingSoles = Math.max(0, Math.floor((baselineBudgetCents - todaySpentCents) / 100));
    const projectedBudgetSoles = Math.floor(projectedBudgetCents / 100);

    const data = [];

    // Hoy
    const topeHoy = Math.floor(baselineBudgetCents / 100);

    data.push({
      day: 1,
      label: "Hoy",
      spent: todaySpentSoles,
      remaining: remainingSoles,
      tope: topeHoy, // Guardar el tope original
      baseline: 0,
      projected: 0,
      isToday: true,
      isUp: false,
    });

    // Próximos 6 días
    for (let i = 0; i < 6; i++) {
      const futureDay = new Date(today);
      futureDay.setDate(today.getDate() + i + 1);

      let dayLabel;
      if (i === 0) {
        dayLabel = "Mañana";
      } else {
        dayLabel = futureDay.toLocaleDateString("es-PE", { weekday: "short" });
      }

      data.push({
        day: i + 2,
        label: dayLabel,
        spent: 0,
        remaining: 0,
        baseline: baselineBudgetSoles,
        projected: projectedBudgetSoles,
        isToday: false,
        isUp: projectedBudgetSoles >= baselineBudgetSoles,
      });
    }

    return data;
  };

  const chartData = getChartData();
  const todayExpenses = getTodayExpenses();
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Botón volver */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 h-10 w-10 rounded-full z-50"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <main className="p-4 pt-16 max-w-2xl mx-auto space-y-6">
        {/* Gráfico minimalista de proyección */}
        <div className="bg-transparent px-2 outline-none focus:outline-none">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 5, left: 5, bottom: 5 }}
              barCategoryGap="15%"
              className="outline-none focus:outline-none"
            >
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 'auto']} />
              {/* Barras para día actual (apiladas) */}
              <Bar
                dataKey="spent"
                stackId="today"
                fill="hsl(var(--primary))"
                radius={[0, 0, 8, 8]}
              >
                <LabelList
                  position="center"
                  fill="white"
                  fontSize={11}
                  fontWeight={700}
                  content={(props: any) => {
                    const { x, y, width, height, value, index } = props;
                    const entry = chartData[index];
                    if (!entry?.isToday || value === 0 || height < 20) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={11}
                        fontWeight={700}
                      >
                        {Math.floor(value)}
                      </text>
                    );
                  }}
                />
              </Bar>
              <Bar
                dataKey="remaining"
                stackId="today"
                fill="hsl(var(--muted))"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  position="top"
                  fill="hsl(var(--foreground))"
                  fontSize={11}
                  fontWeight={700}
                  content={(props: any) => {
                    const { x, y, width, index } = props;
                    const entry = chartData[index];
                    if (!entry?.isToday) return null;
                    // Mostrar el TOPE original, no el total gastado
                    const tope = entry.tope || 0;
                    if (tope === 0) return null;

                    return (
                      <text
                        x={x + width / 2}
                        y={y - 6}
                        fill="hsl(var(--foreground))"
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={700}
                      >
                        {tope}
                      </text>
                    );
                  }}
                />
              </Bar>
              {/* Baseline para días futuros (gris apagado) */}
              <Bar
                dataKey="baseline"
                fill="hsl(var(--muted))"
                opacity={0.5}
                radius={[8, 8, 8, 8]}
              >
                <LabelList
                  position="top"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={12}
                  content={(props: any) => {
                    const { x, y, width, value } = props;
                    if (!value || value === 0) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 6}
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {value.toFixed(0)}
                      </text>
                    );
                  }}
                />
              </Bar>
              {/* Proyección para días futuros (verde/rojo) */}
              <Bar dataKey="projected" radius={[8, 8, 8, 8]}>
                {chartData.map((entry, index) => {
                  if (entry.isToday) return <Cell key={`proj-${index}`} fill="transparent" />;
                  const color = entry.isUp
                    ? "hsl(var(--secondary))"
                    : "hsl(var(--destructive))";
                  return <Cell key={`proj-${index}`} fill={color} />;
                })}
                <LabelList
                  position="top"
                  fill="hsl(var(--foreground))"
                  fontSize={12}
                  fontWeight={700}
                  content={(props: any) => {
                    const { x, y, width, value, index } = props;
                    const entry = chartData[index];
                    if (entry?.isToday || !value || value === 0) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 6}
                        fill="hsl(var(--foreground))"
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={700}
                      >
                        {Math.floor(value)}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gastos de hoy */}
        {todayExpenses.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs text-muted-foreground px-2">Hoy</h3>
            {todayExpenses.map((expense) => {
              const category = categories.find((c) => c.id === expense.category_id);
              const Icon = category ? getCategoryIcon(category.name) : null;

              return (
                <div
                  key={expense.id}
                  className="bg-card/30 rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="bg-secondary/20 p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                    <p className="font-medium">S/ {formatAmount(expense.amount)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.created_at).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <NavFooter />
      <ThemeToggle />
    </div>
  );
}
