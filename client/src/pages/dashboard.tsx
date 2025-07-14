import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import SummaryCards from "@/components/dashboard/summary-cards";
import SalesEntryForm from "@/components/dashboard/sales-entry-form";
import SalesReportTable from "@/components/dashboard/sales-report-table";
import ExpenseEntryForm from "@/components/dashboard/expense-entry-form";
import ExpenseList from "@/components/dashboard/expense-list";
import DailySummary from "@/components/dashboard/daily-summary";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard-summary', today],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" />
      
      <main className="p-6">
        <SummaryCards data={dashboardData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <SalesEntryForm date={today} />
          <SalesReportTable data={dashboardData} />
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-receipt text-red-600 mr-2"></i>
                  Günlük Gider Girişi
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseEntryForm date={today} />
                <ExpenseList date={today} />
              </div>
            </div>
          </div>
        </div>

        <DailySummary data={dashboardData} />
      </main>
    </div>
  );
}
