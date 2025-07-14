import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/excel-export";

interface DailySummaryProps {
  data?: {
    totalSales: number;
    totalCommissions: number;
    netSales: number;
    totalExpenses: number;
    netProfit: number;
    expenses?: Array<{
      category: string;
      amount: string;
    }>;
  };
}

export default function DailySummary({ data }: DailySummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalSales = data?.totalSales || 0;
  const totalCommissions = data?.totalCommissions || 0;
  const netRevenue = data?.netSales || 0;
  const totalExpenses = data?.totalExpenses || 0;
  const netProfit = data?.netProfit || 0;

  // Calculate expense breakdown
  const expenses = data?.expenses || [];
  const materialCosts = expenses
    .filter(e => e.category === 'malzeme')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const staffCosts = expenses
    .filter(e => e.category === 'personel')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const otherCosts = totalExpenses - materialCosts - staffCosts;

  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : "0";

  const handleExport = async () => {
    const today = new Date().toISOString().split('T')[0];
    await exportToExcel(today);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <i className="fas fa-calculator text-green-600 mr-2"></i>
          Günlük Özet Raporu
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Gelir Özeti</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Toplam Satış:</span>
                <span className="font-semibold">{formatCurrency(totalSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Platform Komisyonu:</span>
                <span className="font-semibold text-red-600">-{formatCurrency(totalCommissions)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="font-semibold text-blue-800">Net Gelir:</span>
                <span className="font-bold text-green-600">{formatCurrency(netRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">Gider Özeti</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700">Malzeme:</span>
                <span className="font-semibold">{formatCurrency(materialCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Personel:</span>
                <span className="font-semibold">{formatCurrency(staffCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Diğer:</span>
                <span className="font-semibold">{formatCurrency(otherCosts)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-red-200">
                <span className="font-semibold text-red-800">Toplam Gider:</span>
                <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Net Kar/Zarar</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Net Gelir:</span>
                <span className="font-semibold">{formatCurrency(netRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Toplam Gider:</span>
                <span className="font-semibold text-red-600">-{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-200">
                <span className="font-semibold text-green-800">Net Kar:</span>
                <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
              <div className="mt-2 text-xs text-green-600">
                Kar Marjı: {profitMargin}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Button className="bg-primary text-white hover:bg-blue-600">
            <i className="fas fa-save mr-2"></i>
            Günü Kaydet
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <i className="fas fa-file-excel mr-2"></i>
            Excel Raporu Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
