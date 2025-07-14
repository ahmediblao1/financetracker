import { pgTable, text, serial, integer, decimal, timestamp, date, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dailySales = pgTable("daily_sales", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  trendyolSales: decimal("trendyol_sales", { precision: 10, scale: 2 }).notNull().default("0"),
  yemeksepetiSales: decimal("yemeksepeti_sales", { precision: 10, scale: 2 }).notNull().default("0"),
  salonSales: decimal("salon_sales", { precision: 10, scale: 2 }).notNull().default("0"),
  trendyolCommission: decimal("trendyol_commission", { precision: 10, scale: 2 }).notNull().default("0"),
  yemeksepetiCommission: decimal("yemeksepeti_commission", { precision: 10, scale: 2 }).notNull().default("0"),
  ikramValue: decimal("ikram_value", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  vendor: text("vendor").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  displayName: text("display_name").notNull(),
});

export const dailySalesRelations = relations(dailySales, ({ many }) => ({
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  dailySales: one(dailySales, {
    fields: [expenses.date],
    references: [dailySales.date],
  }),
}));

export const insertDailySalesSchema = createInsertSchema(dailySales).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DailySales = typeof dailySales.$inferSelect;
export type InsertDailySales = z.infer<typeof insertDailySalesSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
