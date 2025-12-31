import { supabase } from "./supabase";
import type { Category, Expense, Settings } from "./database.types";

// Current user ID (hardcoded for now, multi-user ready for future)
const CURRENT_USER_ID = 1;

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", CURRENT_USER_ID)
    .order("order_index");

  if (error) throw error;
  return data || [];
}

export async function createExpense(
  amount: number,
  categoryId: string,
  borrowerName?: string
): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: CURRENT_USER_ID,
      amount,
      category_id: categoryId,
      borrower_name: borrowerName || null,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

export async function getExpensesByMonth(
  year: number,
  month: number
): Promise<Expense[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", CURRENT_USER_ID)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", CURRENT_USER_ID)
    .single();

  if (error) throw error;
  return data;
}
