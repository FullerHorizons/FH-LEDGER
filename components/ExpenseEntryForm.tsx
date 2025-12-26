"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const expenseEntrySchema = z.object({
  expenseDate: z.date({ required_error: "Date is required" }),
  expenseCategory: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  receipt: z.any().optional(),
});

type ExpenseEntryFormData = z.infer<typeof expenseEntrySchema>;

interface ExpenseEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseEntryForm({
  open,
  onOpenChange,
}: ExpenseEntryFormProps) {
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExpenseEntryFormData | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ExpenseEntryFormData>({
    resolver: zodResolver(expenseEntrySchema),
  });

  const handleFileSelect = (file: File) => {
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const onSubmit = (data: ExpenseEntryFormData) => {
    setFormData(data);
    setShowReview(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_MAKE_EXPENSE_WEBHOOK_URL;

      if (!webhookUrl) {
        toast.error("Webhook URL not configured. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("type", "expense_entry");
      formDataToSend.append(
        "expenseDate",
        format(formData.expenseDate, "MM/dd/yyyy")
      );
      formDataToSend.append("expenseCategory", formData.expenseCategory);
      formDataToSend.append("amount", formData.amount);

      if (receiptFile) {
        formDataToSend.append("receipt", receiptFile);
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to submit");

      toast.success("Expense entry submitted successfully!");
      form.reset();
      removeReceipt();
      setShowReview(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit expense entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showReview && formData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[var(--fh-navy)]">
              Review Expense Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Expense Date
                </p>
                <p className="text-base">
                  {format(formData.expenseDate, "MM/dd/yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Category</p>
                <p className="text-base">{formData.expenseCategory}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Amount</p>
                <p className="text-base">${formData.amount}</p>
              </div>
              {receiptPreview && (
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Receipt
                  </p>
                  <div className="relative w-full max-w-md">
                    {receiptFile?.type.startsWith("image/") ? (
                      <Image
                        src={receiptPreview}
                        alt="Receipt"
                        width={400}
                        height={300}
                        className="rounded border"
                      />
                    ) : (
                      <div className="p-4 border rounded bg-gray-50">
                        <p className="text-sm">{receiptFile?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReview(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-[var(--fh-navy)] hover:bg-[var(--fh-navy)]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[var(--fh-navy)]">
            Create Expense Entry
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="expenseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expense Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expenseCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Receipt Upload</FormLabel>
              {receiptPreview ? (
                <div className="space-y-2">
                  <div className="relative w-full max-w-md">
                    {receiptFile?.type.startsWith("image/") ? (
                      <Image
                        src={receiptPreview}
                        alt="Receipt preview"
                        width={400}
                        height={300}
                        className="rounded border"
                      />
                    ) : (
                      <div className="p-4 border rounded bg-gray-50">
                        <p className="text-sm">{receiptFile?.name}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeReceipt}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--fh-navy)] hover:bg-[var(--fh-navy)]/90"
              size="lg"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
