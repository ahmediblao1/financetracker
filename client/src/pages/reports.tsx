import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { exportToExcel } from "@/lib/excel-export";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Reports() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['/api/daily-sales-range', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(`/api/daily-sales-range?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
  });

  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/expenses-range', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(`/api/expenses-range?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
  });

  const isLoading = salesLoading || expensesLoading;

  // Calculate totals
  const totalSales = salesData?.reduce((sum: number, day: any) => {
    return sum + parseFloat(day.trendyolSales || '0') + parseFloat(day.yemeksepetiSales || '0') + parseFloat(day.salonSales || '0');
  }, 0) || 0;

  const totalCommissions = salesData?.reduce((sum: number, day: any) => {
    return sum + parseFloat(day.trendyolCommission || '0') + parseFloat(day.yemeksepetiCommission || '0');
  }, 0) || 0;

  const totalExpenses = expensesData?.reduce((sum: number, expense: any) => {
    return sum + parseFloat(expense.amount || '0');
  }, 0) || 0;

  const netSales = totalSales - totalCommissions;
  const netProfit = netSales - totalExpenses;

  // Group expenses by category
  const expensesByCategory = expensesData?.reduce((acc: any, expense: any) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0, items: [] };
    }
    acc[category].total += parseFloat(expense.amount);
    acc[category].count += 1;
    acc[category].items.push(expense);
    return acc;
  }, {}) || {};

  const handleExportRange = async () => {
    // For range exports, we'll export the first date's format
    await exportToExcel(startDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Header title="Reports" />
      <main className="p-6">
        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleExportRange} className="bg-green-600 hover:bg-green-700">
              <i className="fas fa-download mr-2"></i>
              Export to Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSales)}</p>
              </div>
              <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Commissions</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCommissions)}</p>
              </div>
              <i className="fas fa-percentage text-red-600 text-2xl"></i>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <i className="fas fa-receipt text-orange-600 text-2xl"></i>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </p>
              </div>
              <i className={`fas fa-coins ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'} text-2xl`}></i>
            </div>
          </Card>
        </div>

        {/* Daily Sales Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Daily Sales Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {salesData && salesData.length > 0 ? (
                  salesData.map((day: any) => {
                    const dayTotal = parseFloat(day.trendyolSales || '0') + parseFloat(day.yemeksepetiSales || '0') + parseFloat(day.salonSales || '0');
                    const dayCommissions = parseFloat(day.trendyolCommission || '0') + parseFloat(day.yemeksepetiCommission || '0');
                    return (
                      <div key={day.date} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-600">Sales: {formatCurrency(dayTotal)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{formatCurrency(dayTotal - dayCommissions)}</p>
                            <p className="text-xs text-red-600">-{formatCurrency(dayCommissions)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-chart-line text-4xl mb-4 opacity-30"></i>
                    <p>No sales data for selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Expenses by Category</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.keys(expensesByCategory).length > 0 ? (
                  Object.entries(expensesByCategory).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{category}</p>
                          <p className="text-sm text-gray-600">{data.count} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{formatCurrency(data.total)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((data.total / totalExpenses) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-receipt text-4xl mb-4 opacity-30"></i>
                    <p>No expenses for selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0}%
                </p>
                <p className="text-gray-600">Profit Margin</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {salesData?.length || 0}
                </p>
                <p className="text-gray-600">Active Days</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {salesData?.length > 0 ? formatCurrency(totalSales / salesData.length) : formatCurrency(0)}
                </p>
                <p className="text-gray-600">Average Daily Sales</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
