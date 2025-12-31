export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          created_at: string;
        };
        Insert: {
          id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: number;
          name: string;
          order_index: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: number;
          name: string;
          order_index: number;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          name?: string;
          order_index?: number;
          is_default?: boolean;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: number;
          amount: number;
          category_id: string;
          borrower_name: string | null;
          is_returned: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: number;
          amount: number;
          category_id: string;
          borrower_name?: string | null;
          is_returned?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          amount?: number;
          category_id?: string;
          borrower_name?: string | null;
          is_returned?: boolean;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: number;
          monthly_limit: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: number;
          monthly_limit?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          monthly_limit?: number;
          created_at?: string;
        };
      };
    };
  };
};

export type User = Database['public']['Tables']['users']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Settings = Database['public']['Tables']['settings']['Row'];
