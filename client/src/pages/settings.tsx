import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <div>
      <Header title="Settings" />
      <main className="p-6">
        {/* App Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium">USD ($)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Rates</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Trendyol:</span>
                <span className="font-medium text-red-600">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yemeksepeti:</span>
                <span className="font-medium text-red-600">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In-Store:</span>
                <span className="font-medium text-green-600">0%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Daily Sales Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Expense Management</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Commission Calculation</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Excel Export</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Real-time Reports</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-gray-700">Date Range Analysis</span>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
          <div className="text-gray-600 space-y-3">
            <p>
              This Restaurant Accounting System is designed to help restaurant owners track their daily operations,
              including sales from multiple platforms (Trendyol, Yemeksepeti, and in-store), manage expenses,
              and generate comprehensive reports.
            </p>
            <p>
              The system automatically calculates platform commissions and provides real-time insights into your
              restaurant's financial performance, helping you make informed business decisions.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Support</h4>
              <p className="text-blue-700 text-sm">
                For technical support or questions about using the system, please refer to the documentation
                or contact your system administrator.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
