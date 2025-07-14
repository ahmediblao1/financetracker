import { users, dailySales, expenses, expenseCategories, type User, type InsertUser, type DailySales, type InsertDailySales, type Expense, type InsertExpense, type ExpenseCategory, type InsertExpenseCategory } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sum } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Daily sales methods
  getDailySales(date: string): Promise<DailySales | undefined>;
  createDailySales(sales: InsertDailySales): Promise<DailySales>;
  updateDailySales(date: string, sales: Partial<InsertDailySales>): Promise<DailySales>;
  getDailySalesRange(startDate: string, endDate: string): Promise<DailySales[]>;

  // Expense methods
  getExpensesByDate(date: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
  getExpensesRange(startDate: string, endDate: string): Promise<Expense[]>;

  // Expense category methods
  getExpenseCategories(): Promise<ExpenseCategory[]>;
  createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory>;

  // Analytics methods
  getMonthlyStats(year: number, month: number): Promise<{
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    daysActive: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getDailySales(date: string): Promise<DailySales | undefined> {
    const [sales] = await db.select().from(dailySales).where(eq(dailySales.date, date));
    return sales || undefined;
  }

  async createDailySales(sales: InsertDailySales): Promise<DailySales> {
    const [created] = await db
      .insert(dailySales)
      .values(sales)
      .returning();
    return created;
  }

  async updateDailySales(date: string, sales: Partial<InsertDailySales>): Promise<DailySales> {
    const [updated] = await db
      .update(dailySales)
      .set(sales)
      .where(eq(dailySales.date, date))
      .returning();
    return updated;
  }

  async getDailySalesRange(startDate: string, endDate: string): Promise<DailySales[]> {
    return await db
      .select()
      .from(dailySales)
      .where(and(gte(dailySales.date, startDate), lte(dailySales.date, endDate)))
      .orderBy(desc(dailySales.date));
  }

  async getExpensesByDate(date: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.date, date))
      .orderBy(desc(expenses.createdAt));
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [created] = await db
      .insert(expenses)
      .values(expense)
      .returning();
    return created;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async getExpensesRange(startDate: string, endDate: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.date, startDate), lte(expenses.date, endDate)))
      .orderBy(desc(expenses.date));
  }

  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    return await db.select().from(expenseCategories);
  }

  async createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory> {
    const [created] = await db
      .insert(expenseCategories)
      .values(category)
      .returning();
    return created;
  }

  async getMonthlyStats(year: number, month: number): Promise<{
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    daysActive: number;
  }> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const salesData = await this.getDailySalesRange(startDate, endDate);
    const expensesData = await this.getExpensesRange(startDate, endDate);

    const totalSales = salesData.reduce((sum, day) => {
      return sum + 
        parseFloat(day.trendyolSales || '0') + 
        parseFloat(day.yemeksepetiSales || '0') + 
        parseFloat(day.salonSales || '0');
    }, 0);

    const totalCommissions = salesData.reduce((sum, day) => {
      return sum + 
        parseFloat(day.trendyolCommission || '0') + 
        parseFloat(day.yemeksepetiCommission || '0');
    }, 0);

    const totalExpenses = expensesData.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount || '0');
    }, 0);

    const netSales = totalSales - totalCommissions;
    const netProfit = netSales - totalExpenses;

    return {
      totalSales: netSales,
      totalExpenses,
      netProfit,
      daysActive: salesData.length
    };
  }
}

export const storage = new DatabaseStorage();
