interface SalesReportTableProps {
  data?: {
    sales?: {
      trendyolSales: string;
      yemeksepetiSales: string;
      salonSales: string;
      trendyolCommission: string;
      yemeksepetiCommission: string;
    };
    ikramValue: number;
  };
}

export default function SalesReportTable({ data }: SalesReportTableProps) {
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount || 0);
  };

  const sales = data?.sales;
  const ikramValue = data?.ikramValue || 0;

  const trendyolSales = parseFloat(sales?.trendyolSales || "0");
  const yemeksepetiSales = parseFloat(sales?.yemeksepetiSales || "0");
  const salonSales = parseFloat(sales?.salonSales || "0");
  const trendyolCommission = parseFloat(sales?.trendyolCommission || "0");
  const yemeksepetiCommission = parseFloat(sales?.yemeksepetiCommission || "0");

  const trendyolNet = trendyolSales - trendyolCommission;
  const yemeksepetiNet = yemeksepetiSales - yemeksepetiCommission;
  const salonNet = salonSales;

  const totalSales = trendyolSales + yemeksepetiSales + salonSales;
  const totalCommission = trendyolCommission + yemeksepetiCommission;
  const totalNet = trendyolNet + yemeksepetiNet + salonNet;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <i className="fas fa-chart-bar text-green-600 mr-2"></i>
          Bugünkü Satış Raporu
        </h3>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="text-left py-2 px-3 font-semibold">Platform</th>
                <th className="text-right py-2 px-3 font-semibold">Satış</th>
                <th className="text-right py-2 px-3 font-semibold">Komisyon</th>
                <th className="text-right py-2 px-3 font-semibold">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-3 font-medium">Trendyol</td>
                <td className="py-2 px-3 text-right">{formatCurrency(trendyolSales)}</td>
                <td className="py-2 px-3 text-right text-red-600">{formatCurrency(trendyolCommission)}</td>
                <td className="py-2 px-3 text-right font-semibold text-green-600">{formatCurrency(trendyolNet)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Yemeksepeti</td>
                <td className="py-2 px-3 text-right">{formatCurrency(yemeksepetiSales)}</td>
                <td className="py-2 px-3 text-right text-red-600">{formatCurrency(yemeksepetiCommission)}</td>
                <td className="py-2 px-3 text-right font-semibold text-green-600">{formatCurrency(yemeksepetiNet)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Salon</td>
                <td className="py-2 px-3 text-right">{formatCurrency(salonSales)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                <td className="py-2 px-3 text-right font-semibold text-green-600">{formatCurrency(salonNet)}</td>
              </tr>
              <tr className="bg-yellow-50 font-bold">
                <td className="py-2 px-3">TOPLAM</td>
                <td className="py-2 px-3 text-right">{formatCurrency(totalSales)}</td>
                <td className="py-2 px-3 text-right text-red-600">{formatCurrency(totalCommission)}</td>
                <td className="py-2 px-3 text-right text-lg text-green-600">{formatCurrency(totalNet)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {ikramValue > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-orange-800 font-medium">İkram Ürün Değeri:</span>
              <span className="font-bold text-orange-600">{formatCurrency(ikramValue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
