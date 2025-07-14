import { exportToExcel } from "@/lib/excel-export";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const handleExport = async () => {
    const today = new Date().toISOString().split('T')[0];
    await exportToExcel(today);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{currentDate}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-primary text-white hover:bg-blue-600">
            <i className="fas fa-plus mr-2"></i>
            Quick Entry
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <i className="fas fa-download mr-2"></i>
            Export Excel
          </Button>
        </div>
      </div>
    </header>
  );
}
