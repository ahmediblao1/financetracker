import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Expense } from "@shared/schema";

interface ExpenseListProps {
  date: string;
}

export default function ExpenseList({ date }: ExpenseListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses', date],
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
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-summary'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount || 0);
  };

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
      // Legacy Turkish categories for backward compatibility
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-4">Today's Expenses</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-receipt text-4xl mb-4 opacity-30"></i>
            <p>No expenses added yet</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{getCategoryLabel(expense.category)}</p>
                  <p className="text-sm text-gray-600">{expense.vendor}</p>
                  <p className="text-xs text-gray-500">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(expense.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs text-gray-400 hover:text-red-600 p-1 h-auto"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-red-800 font-medium">Total Daily Expenses:</span>
          <span className="font-bold text-red-600 text-lg">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
    </div>
  );
}
