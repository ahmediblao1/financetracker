import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ExpenseEntryForm from "@/components/dashboard/expense-entry-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Expense } from "@shared/schema";

export default function Expenses() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses', selectedDate],
  });

  const deleteMutation = useMutation({
    mutationFn: async (expenseId: number) => {
      await apiRequest("DELETE", `/api/expenses/${expenseId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      food: "Food & Beverages",
      staff: "Staff Salary",
      rent: "Rent",
      electricity: "Electricity",
      water: "Water",
      gas: "Gas",
      maintenance: "Maintenance",
      other: "Other",
      // Legacy categories
      malzeme: "Food & Beverages",
      personel: "Staff Salary",
      kira: "Rent",
      elektrik: "Electricity",
      su: "Water",
      gaz: "Gas",
      bakim: "Maintenance",
      diger: "Other",
    };
    return categoryMap[category] || category;
  };

  const categories = ["all", "food", "staff", "rent", "electricity", "water", "gas", "maintenance", "other"];

  const filteredExpenses = expenses.filter(expense => 
    filterCategory === "all" || expense.category === filterCategory
  );

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc: any, expense: any) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 };
    }
    acc[category].total += parseFloat(expense.amount);
    acc[category].count += 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Header title="Expenses" />
      <main className="p-6">
        {/* Date and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Filtered</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        {/* Add New Expense */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Add New Expense</h3>
            </div>
            <div className="p-6">
              <ExpenseEntryForm date={selectedDate} />
            </div>
          </div>

          {/* Category Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Category Summary</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.keys(expensesByCategory).length > 0 ? (
                  Object.entries(expensesByCategory).map(([category, data]: [string, any]) => (
                    <div key={category} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium text-gray-800">{getCategoryLabel(category)}</p>
                        <p className="text-sm text-gray-600">{data.count} item{data.count !== 1 ? 's' : ''}</p>
                      </div>
                      <p className="font-semibold text-red-600">{formatCurrency(data.total)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-receipt text-4xl mb-4 opacity-30"></i>
                    <p>No expenses for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Expense Details {filterCategory !== "all" && `- ${getCategoryLabel(filterCategory)}`}
              </h3>
              <p className="text-sm text-gray-600">
                {filteredExpenses.length} item{filteredExpenses.length !== 1 ? 's' : ''} • {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div key={expense.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {getCategoryLabel(expense.category)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(expense.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 mb-1">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-store mr-1"></i>
                          {expense.vendor}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-red-600 text-lg">{formatCurrency(expense.amount)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(expense.id)}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-gray-400 hover:text-red-600 mt-1"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-receipt text-5xl mb-4 opacity-30"></i>
                  <p className="text-lg">No expenses found</p>
                  <p className="text-sm">
                    {filterCategory !== "all" 
                      ? `No expenses in ${getCategoryLabel(filterCategory)} category for this date`
                      : "No expenses recorded for this date"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
