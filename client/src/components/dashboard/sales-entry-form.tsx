import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const salesFormSchema = z.object({
  trendyolSales: z.string().min(0),
  yemeksepetiSales: z.string().min(0),
  salonSales: z.string().min(0),
  ikramValue: z.string().min(0),
});

type SalesFormData = z.infer<typeof salesFormSchema>;

interface SalesEntryFormProps {
  date: string;
}

export default function SalesEntryForm({ date }: SalesEntryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SalesFormData>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      trendyolSales: "0",
      yemeksepetiSales: "0",
      salonSales: "0",
      ikramValue: "0",
    },
  });

  const { watch } = form;
  const watchedValues = watch();

  // Calculate real-time totals
  const trendyolSales = parseFloat(watchedValues.trendyolSales || "0");
  const yemeksepetiSales = parseFloat(watchedValues.yemeksepetiSales || "0");
  const salonSales = parseFloat(watchedValues.salonSales || "0");

  const trendyolCommission = trendyolSales * 0.15;
  const yemeksepetiCommission = yemeksepetiSales * 0.18;
  const totalSales = trendyolSales + yemeksepetiSales + salonSales;
  const totalCommission = trendyolCommission + yemeksepetiCommission;
  const netSales = totalSales - totalCommission;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const salesMutation = useMutation({
    mutationFn: async (data: SalesFormData) => {
      const response = await apiRequest("POST", "/api/daily-sales", {
        date,
        trendyolSales: data.trendyolSales,
        yemeksepetiSales: data.yemeksepetiSales,
        salonSales: data.salonSales,
        ikramValue: data.ikramValue,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Satış verileri kaydedildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-summary'] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Satış verileri kaydedilemedi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SalesFormData) => {
    salesMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <i className="fas fa-edit text-primary mr-2"></i>
          Günlük Satış Girişi
        </h3>
      </div>
      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trendyolSales">Trendyol Satış</Label>
              <Input
                id="trendyolSales"
                type="number"
                step="0.01"
                placeholder="0"
                {...form.register("trendyolSales")}
              />
              <p className="text-xs text-gray-500 mt-1">Komisyon: %15 (otomatik hesaplanacak)</p>
            </div>
            <div>
              <Label htmlFor="yemeksepetiSales">Yemeksepeti Satış</Label>
              <Input
                id="yemeksepetiSales"
                type="number"
                step="0.01"
                placeholder="0"
                {...form.register("yemeksepetiSales")}
              />
              <p className="text-xs text-gray-500 mt-1">Komisyon: %18 (otomatik hesaplanacak)</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="salonSales">Salon Satış</Label>
            <Input
              id="salonSales"
              type="number"
              step="0.01"
              placeholder="0"
              {...form.register("salonSales")}
            />
          </div>

          <div>
            <Label htmlFor="ikramValue">İkram Ürün Değeri</Label>
            <Input
              id="ikramValue"
              type="number"
              step="0.01"
              placeholder="0"
              {...form.register("ikramValue")}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Satış:</span>
                <span className="font-semibold">{formatCurrency(totalSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Komisyon:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalCommission)}</span>
              </div>
              <div className="flex justify-between col-span-2 pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-medium">Net Satış:</span>
                <span className="font-bold text-green-600">{formatCurrency(netSales)}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={salesMutation.isPending}
          >
            {salesMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Kaydediliyor...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Satış Verilerini Kaydet
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
