import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { path: "/daily-entry", label: "Daily Entry", icon: "fas fa-cash-register" },
  { path: "/reports", label: "Reports", icon: "fas fa-chart-line" },
  { path: "/expenses", label: "Expenses", icon: "fas fa-receipt" },
  { path: "/settings", label: "Settings", icon: "fas fa-cog" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          <i className="fas fa-utensils text-primary mr-2"></i>
          Restaurant Accounting
        </h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={cn(
                "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer",
                location === item.path && "text-primary bg-blue-50 border-r-2 border-primary"
              )}
            >
              <i className={`${item.icon} mr-3`}></i>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
