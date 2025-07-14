interface SummaryCardsProps {
  data?: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
  };
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalSales = data?.totalSales || 0;
  const totalExpenses = data?.totalExpenses || 0;
  const netProfit = data?.netProfit || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Daily Sales</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
            <p className="text-green-600 text-sm mt-1">
              <i className="fas fa-arrow-up mr-1"></i>
              After platform commissions
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <i className="fas fa-chart-line text-primary text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Daily Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            <p className="text-gray-600 text-sm mt-1">
              <i className="fas fa-info-circle mr-1"></i>
              All expense categories
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <i className="fas fa-receipt text-red-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Net Profit</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className={`text-sm mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <i className={`fas fa-arrow-${netProfit >= 0 ? 'up' : 'down'} mr-1`}></i>
              Sales - Expenses
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <i className="fas fa-coins text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Profit Margin</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0}%
            </p>
            <p className="text-orange-600 text-sm mt-1">
              <i className="fas fa-percentage mr-1"></i>
              Profitability ratio
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <i className="fas fa-bullseye text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
