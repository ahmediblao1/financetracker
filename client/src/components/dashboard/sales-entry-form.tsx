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
  trendyolSales: z.coerce.number().min(0, "Trendyol sales must be a positive number"),
  yemeksepetiSales: z.coerce.number().min(0, "Yemeksepeti sales must be a positive number"),
  salonSales: z.coerce.number().min(0, "In-store sales must be a positive number"),
  ikramValue: z.coerce.number().min(0, "Complimentary items value must be a positive number"),
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
        title: "Success",
        description: "Sales data saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-summary'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save sales data",
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
          Daily Sales Entry
        </h3>
      </div>
      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trendyolSales">Trendyol Sales</Label>
              <Input
                id="trendyolSales"
                type="number"
                step="0.01"
                placeholder="0"
                {...form.register("trendyolSales")}
              />
              {form.formState.errors.trendyolSales && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.trendyolSales.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Commission: 15% (calculated automatically)</p>
            </div>
            <div>
              <Label htmlFor="yemeksepetiSales">Yemeksepeti Sales</Label>
              <Input
                id="yemeksepetiSales"
                type="number"
                step="0.01"
                placeholder="0"
                {...form.register("yemeksepetiSales")}
              />
              {form.formState.errors.yemeksepetiSales && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.yemeksepetiSales.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Commission: 18% (calculated automatically)</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="salonSales">In-Store Sales</Label>
            <Input
              id="salonSales"
              type="number"
              step="0.01"
              placeholder="0"
              {...form.register("salonSales")}
            />
            {form.formState.errors.salonSales && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.salonSales.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ikramValue">Complimentary Items Value</Label>
            <Input
              id="ikramValue"
              type="number"
              step="0.01"
              placeholder="0"
              {...form.register("ikramValue")}
            />
            {form.formState.errors.ikramValue && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.ikramValue.message}</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="font-semibold">{formatCurrency(totalSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Commission:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalCommission)}</span>
              </div>
              <div className="flex justify-between col-span-2 pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-medium">Net Sales:</span>
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
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Sales Data
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
