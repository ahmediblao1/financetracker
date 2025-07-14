import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const expenseFormSchema = z.object({
  category: z.string().min(1, "Kategori seçin"),
  amount: z.string().min(1, "Tutar girin"),
  description: z.string().min(1, "Açıklama girin"),
  vendor: z.string().min(1, "Tedarikçi/yer bilgisini girin"),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseEntryFormProps {
  date: string;
}

const expenseCategories = [
  { value: "malzeme", label: "Malzeme/İçecek" },
  { value: "personel", label: "Personel Maaşı" },
  { value: "kira", label: "Kira" },
  { value: "elektrik", label: "Elektrik" },
  { value: "su", label: "Su" },
  { value: "gaz", label: "Gaz" },
  { value: "bakim", label: "Bakım/Onarım" },
  { value: "diger", label: "Diğer" },
];

export default function ExpenseEntryForm({ date }: ExpenseEntryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      description: "",
      vendor: "",
    },
  });

  const expenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const response = await apiRequest("POST", "/api/expenses", {
        date,
        category: data.category,
        amount: data.amount,
        description: data.description,
        vendor: data.vendor,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Gider kaydedildi",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-summary'] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Gider kaydedilemedi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    expenseMutation.mutate(data);
  };

  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-4">Yeni Gider Girişi</h4>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select onValueChange={(value) => form.setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori Seçin" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Tutar</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("amount")}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Açıklama</Label>
          <Input
            id="description"
            placeholder="Gider detayı..."
            {...form.register("description")}
          />
        </div>

        <div>
          <Label htmlFor="vendor">Tedarikçi/Yer</Label>
          <Input
            id="vendor"
            placeholder="Nereden alındı?"
            {...form.register("vendor")}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={expenseMutation.isPending}
        >
          {expenseMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Ekleniyor...
            </>
          ) : (
            <>
              <i className="fas fa-plus mr-2"></i>
              Gider Ekle
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
