-- Expense Tracker Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (preparado para multi-usuario en el futuro)
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default user (id = 1)
INSERT INTO users (id) VALUES (1);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL REFERENCES users(id) DEFAULT 1,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial categories for user 1
INSERT INTO categories (user_id, name, order_index, is_default) VALUES
  (1, 'Transporte', 1, true),
  (1, 'Deporte', 2, false),
  (1, 'Antojo', 3, false),
  (1, 'Básico', 4, false),
  (1, 'Entretenimiento', 5, false),
  (1, 'Mascota', 6, false),
  (1, 'Detalles', 7, false),
  (1, 'Préstamo', 8, false);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL REFERENCES users(id) DEFAULT 1,
  amount INTEGER NOT NULL, -- amount in centavos (100 = S/1.00)
  category_id UUID NOT NULL REFERENCES categories(id),
  borrower_name TEXT, -- only for "Préstamo" category
  is_returned BOOLEAN DEFAULT false, -- only for loans
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL REFERENCES users(id) DEFAULT 1,
  monthly_limit INTEGER NOT NULL DEFAULT 250000, -- S/2500.00 in centavos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings for user 1
INSERT INTO settings (user_id, monthly_limit) VALUES (1, 250000);

-- Create indexes for faster queries
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_order ON categories(order_index);
CREATE INDEX idx_settings_user_id ON settings(user_id);

-- Create unique constraint: one settings row per user
CREATE UNIQUE INDEX idx_settings_unique_user ON settings(user_id);
