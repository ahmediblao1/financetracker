import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import SalesEntryForm from "@/components/dashboard/sales-entry-form";
import ExpenseEntryForm from "@/components/dashboard/expense-entry-form";
import ExpenseList from "@/components/dashboard/expense-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function DailyEntry() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard-summary', selectedDate],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Header title="Daily Entry" />
      <main className="p-6">
        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Selected Date</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedDate)}</p>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm font-medium">Total Sales</p>
            <p className="text-xl font-bold text-blue-800">
              {formatCurrency(dashboardData?.totalSales || 0)}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-red-800">
              {formatCurrency(dashboardData?.totalExpenses || 0)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-medium">Net Sales</p>
            <p className="text-xl font-bold text-green-800">
              {formatCurrency(dashboardData?.netSales || 0)}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-700 text-sm font-medium">Net Profit</p>
            <p className={`text-xl font-bold ${(dashboardData?.netProfit || 0) >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              {formatCurrency(dashboardData?.netProfit || 0)}
            </p>
          </div>
        </div>

        {/* Sales Entry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesEntryForm date={selectedDate} />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="fas fa-chart-bar text-green-600 mr-2"></i>
                Sales Summary
              </h3>
            </div>
            <div className="p-6">
              {dashboardData?.sales ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trendyol:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(dashboardData.sales.trendyolSales || '0'))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Yemeksepeti:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(dashboardData.sales.yemeksepetiSales || '0'))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In-Store:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(dashboardData.sales.salonSales || '0'))}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Total Commissions:</span>
                      <span className="font-bold text-red-600">{formatCurrency(dashboardData.totalCommissions || 0)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-chart-line text-4xl mb-4 opacity-30"></i>
                  <p>No sales data for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expense Entry */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <i className="fas fa-receipt text-red-600 mr-2"></i>
              Expense Management
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseEntryForm date={selectedDate} />
              <ExpenseList date={selectedDate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
