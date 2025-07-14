import * as XLSX from 'xlsx';
import { apiRequest } from './queryClient';

export async function exportToExcel(date: string) {
  try {
    // Fetch dashboard data
    const dashboardResponse = await fetch(`/api/dashboard-summary/${date}`);
    const dashboardData = await dashboardResponse.json();
    
    // Fetch expenses
    const expensesResponse = await fetch(`/api/expenses/${date}`);
    const expenses = await expensesResponse.json();

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sales Summary Sheet
    const salesData = [
      ['Restoran Muhasebe Sistemi - Günlük Rapor'],
      ['Tarih:', new Date(date).toLocaleDateString('tr-TR')],
      [],
      ['SATIŞ BİLGİLERİ'],
      ['Platform', 'Satış', 'Komisyon', 'Net'],
    ];

    if (dashboardData.sales) {
      const sales = dashboardData.sales;
      const trendyolSales = parseFloat(sales.trendyolSales || '0');
      const yemeksepetiSales = parseFloat(sales.yemeksepetiSales || '0');
      const salonSales = parseFloat(sales.salonSales || '0');
      const trendyolCommission = parseFloat(sales.trendyolCommission || '0');
      const yemeksepetiCommission = parseFloat(sales.yemeksepetiCommission || '0');

      salesData.push(
        ['Trendyol', trendyolSales, trendyolCommission, trendyolSales - trendyolCommission],
        ['Yemeksepeti', yemeksepetiSales, yemeksepetiCommission, yemeksepetiSales - yemeksepetiCommission],
        ['Salon', salonSales, 0, salonSales],
        [],
        ['TOPLAM', dashboardData.totalSales, dashboardData.totalCommissions, dashboardData.netSales]
      );
    }

    const salesWs = XLSX.utils.aoa_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, salesWs, 'Satış Raporu');

    // Expenses Sheet
    const expensesData = [
      ['GİDER DETAYLARI'],
      ['Kategori', 'Açıklama', 'Tedarikçi', 'Tutar'],
    ];

    expenses.forEach((expense: any) => {
      const categoryMap: Record<string, string> = {
        malzeme: 'Malzeme/İçecek',
        personel: 'Personel Maaşı',
        kira: 'Kira',
        elektrik: 'Elektrik',
        su: 'Su',
        gaz: 'Gaz',
        bakim: 'Bakım/Onarım',
        diger: 'Diğer',
      };
      
      expensesData.push([
        categoryMap[expense.category] || expense.category,
        expense.description,
        expense.vendor,
        parseFloat(expense.amount)
      ]);
    });

    expensesData.push(
      [],
      ['TOPLAM GİDER', '', '', dashboardData.totalExpenses]
    );

    const expensesWs = XLSX.utils.aoa_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(wb, expensesWs, 'Giderler');

    // Summary Sheet
    const summaryData = [
      ['GÜNLÜK ÖZET'],
      [],
      ['Toplam Satış', dashboardData.totalSales],
      ['Platform Komisyonu', dashboardData.totalCommissions],
      ['Net Satış', dashboardData.netSales],
      ['Toplam Gider', dashboardData.totalExpenses],
      [],
      ['NET KAR/ZARAR', dashboardData.netProfit],
      ['Kar Marjı (%)', dashboardData.totalSales > 0 ? Math.round((dashboardData.netProfit / dashboardData.totalSales) * 100) : 0],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Özet');

    // Generate and download file
    const fileName = `restoran_raporu_${date}.xlsx`;
    XLSX.writeFile(wb, fileName);

  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Excel export failed');
  }
}
