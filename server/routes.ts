import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDailySalesSchema, insertExpenseSchema, insertExpenseCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Daily Sales Routes
  app.get("/api/daily-sales/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const sales = await storage.getDailySales(date);
      res.json(sales || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily sales" });
    }
  });

  app.post("/api/daily-sales", async (req, res) => {
    try {
      const validatedData = insertDailySalesSchema.parse(req.body);
      
      // Calculate commissions
      const trendyolCommission = parseFloat(validatedData.trendyolSales || "0") * 0.15;
      const yemeksepetiCommission = parseFloat(validatedData.yemeksepetiSales || "0") * 0.18;

      const salesData = {
        ...validatedData,
        trendyolCommission: trendyolCommission.toFixed(2),
        yemeksepetiCommission: yemeksepetiCommission.toFixed(2)
      };

      // Check if sales for this date already exist
      const existingSales = await storage.getDailySales(validatedData.date);
      
      let sales;
      if (existingSales) {
        sales = await storage.updateDailySales(validatedData.date, salesData);
      } else {
        sales = await storage.createDailySales(salesData);
      }
      
      res.json(sales);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save daily sales" });
      }
    }
  });

  app.get("/api/daily-sales-range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const sales = await storage.getDailySalesRange(startDate as string, endDate as string);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sales range" });
    }
  });

  // Expense Routes
  app.get("/api/expenses/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const expenses = await storage.getExpensesByDate(date);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create expense" });
      }
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteExpense(parseInt(id));
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Daily sales range endpoint
  app.get("/api/daily-sales-range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const salesData = await storage.getDailySalesRange(startDate as string, endDate as string);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily sales range" });
    }
  });

  app.get("/api/expenses-range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const expenses = await storage.getExpensesRange(startDate as string, endDate as string);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expenses range" });
    }
  });

  // Expense Categories Routes
  app.get("/api/expense-categories", async (req, res) => {
    try {
      const categories = await storage.getExpenseCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expense categories" });
    }
  });

  app.post("/api/expense-categories", async (req, res) => {
    try {
      const validatedData = insertExpenseCategorySchema.parse(req.body);
      const category = await storage.createExpenseCategory(validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create expense category" });
      }
    }
  });

  // Analytics Routes
  app.get("/api/monthly-stats/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const stats = await storage.getMonthlyStats(parseInt(year), parseInt(month));
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get monthly stats" });
    }
  });

  // Dashboard summary for today
  app.get("/api/dashboard-summary/:date", async (req, res) => {
    try {
      const { date } = req.params;
      
      const sales = await storage.getDailySales(date);
      const expenses = await storage.getExpensesByDate(date);
      
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      
      let totalSales = 0;
      let totalCommissions = 0;
      let ikramValue = 0;
      
      if (sales) {
        totalSales = parseFloat(sales.trendyolSales) + 
                    parseFloat(sales.yemeksepetiSales) + 
                    parseFloat(sales.salonSales);
        totalCommissions = parseFloat(sales.trendyolCommission) + 
                          parseFloat(sales.yemeksepetiCommission);
        ikramValue = parseFloat(sales.ikramValue);
      }
      
      const netSales = totalSales - totalCommissions;
      const netProfit = netSales - totalExpenses;
      
      res.json({
        totalSales,
        totalCommissions,
        netSales,
        totalExpenses,
        netProfit,
        ikramValue,
        sales,
        expenses
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
