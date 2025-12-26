"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceFormSchema, InvoiceFormData } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export function InvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entryType, setEntryType] = useState<'consulting' | 'expense'>('consulting');
  const [suggestedInvoiceNumber, setSuggestedInvoiceNumber] = useState<string>('');

  const formMethods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      entryType: 'consulting',
      dateSubmitted: new Date().toISOString().split('T')[0],
    },
  });

  const { register, handleSubmit, watch, setValue, formState, reset } = formMethods;
  const { errors } = formState;

  const billableHrs = watch("billableTimeHrs");
  const hourlyRate = watch("clientHourlyRate");

  useEffect(() => {
    if (billableHrs && hourlyRate) {
      const amountDue = billableHrs * hourlyRate;
      setValue("amountDue", parseFloat(amountDue.toFixed(2)));
    }
  }, [billableHrs, hourlyRate, setValue]);

  useEffect(() => {
    async function fetchSuggestedNumber() {
      if (entryType === 'consulting') {
        try {
          const response = await fetch('/api/get-next-invoice');
          if (response.ok) {
            const data = await response.json();
            setSuggestedInvoiceNumber(data.nextInvoiceNumber);
            setValue("invoiceNumber", data.nextInvoiceNumber);
          }
        } catch (error) {
          console.error("Failed to fetch next invoice number:", error);
        }
      }
    }
    fetchSuggestedNumber();
  }, [entryType, setValue]);

  useEffect(() => {
    setValue("entryType", entryType);
  }, [entryType, setValue]);

  async function onSubmit(data: InvoiceFormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create invoice");
      }

      const result = await response.json();
      setSuccess(true);
      toast.success("Invoice created successfully!", {
        description: `Invoice #${data.entryType === 'consulting' ? data.invoiceNumber : data.jrfInvoiceNumber} - Amount: $${data.amountDue?.toFixed(2) || '0.00'}`,
      });

      setTimeout(() => {
        setSuccess(false);
        if (entryType === 'consulting') {
          reset({
            entryType: 'consulting',
            invoiceNumber: suggestedInvoiceNumber,
            dateSubmitted: new Date().toISOString().split('T')[0],
          });
          fetchNewInvoiceNumber();
        } else {
          reset({
            entryType: 'expense',
            jrfInvoiceNumber: '',
            dateSubmitted: new Date().toISOString().split('T')[0],
          });
        }
      }, 3000);
    } catch (error) {
      toast.error("Failed to create invoice", {
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function fetchNewInvoiceNumber() {
    if (entryType === 'consulting') {
      try {
        const response = await fetch('/api/get-next-invoice');
        if (response.ok) {
          const data = await response.json();
          setSuggestedInvoiceNumber(data.nextInvoiceNumber);
          setValue("invoiceNumber", data.nextInvoiceNumber);
        }
      } catch (error) {
        console.error("Failed to fetch next invoice number:", error);
      }
    }
  }

  const amountDue = watch("amountDue");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="border-gray-700 bg-white/95 backdrop-blur">
        <CardHeader className="bg-[#0a1628] border-b border-gray-700">
          <CardTitle className="text-white text-2xl">Entry Type</CardTitle>
          <CardDescription className="text-gray-300">
            Select the type of entry you want to create
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={entryType === 'consulting' ? 'default' : 'outline'}
              onClick={() => setEntryType('consulting')}
              className={entryType === 'consulting' ? 'bg-[#0a1628] hover:bg-[#1a2638]' : ''}
            >
              Consulting Entry
            </Button>
            <Button
              type="button"
              variant={entryType === 'expense' ? 'default' : 'outline'}
              onClick={() => setEntryType('expense')}
              className={entryType === 'expense' ? 'bg-[#0a1628] hover:bg-[#1a2638]' : ''}
            >
              Expense Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-gray-700 bg-white/95 backdrop-blur">
          <CardHeader className="bg-[#0a1628] border-b border-gray-700">
            <CardTitle className="text-white">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {entryType === 'consulting' ? (
              <div>
                <Label htmlFor="invoiceNumber" className="text-[#0a1628]">Invoice # *</Label>
                <Input
                  id="invoiceNumber"
                  {...register("invoiceNumber")}
                  placeholder={suggestedInvoiceNumber || "FH-2025-0001"}
                  className="border-gray-300 focus:border-[#0a1628]"
                />
                {'invoiceNumber' in errors && errors.invoiceNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.invoiceNumber.message}</p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="jrfInvoiceNumber" className="text-[#0a1628]">JRF Invoice # *</Label>
                <Input
                  id="jrfInvoiceNumber"
                  {...register("jrfInvoiceNumber")}
                  placeholder="JRF-2025-0001"
                  className="border-gray-300 focus:border-[#0a1628]"
                />
                {'jrfInvoiceNumber' in errors && errors.jrfInvoiceNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.jrfInvoiceNumber.message}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="dateSubmitted" className="text-[#0a1628]">Date Submitted</Label>
              <Input
                id="dateSubmitted"
                type="date"
                {...register("dateSubmitted")}
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>

            <div>
              <Label htmlFor="datePerformed" className="text-[#0a1628]">Date Performed</Label>
              <Input
                id="datePerformed"
                type="date"
                {...register("datePerformed")}
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-white/95 backdrop-blur">
          <CardHeader className="bg-[#0a1628] border-b border-gray-700">
            <CardTitle className="text-white">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="cwClientName" className="text-[#0a1628]">CW - Client Name</Label>
              <Input
                id="cwClientName"
                {...register("cwClientName")}
                placeholder="Client Company Name"
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-[#0a1628]">Category</Label>
              <Select onValueChange={(value) => setValue("category", value as any)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  {entryType === 'expense' && <SelectItem value="Networking">Networking</SelectItem>}
                  <SelectItem value="Project Management">Project Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cwCategory" className="text-[#0a1628]">CW - Category</Label>
              <Select onValueChange={(value) => setValue("cwCategory", value as any)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select CW category" />
                </SelectTrigger>
                <SelectContent>
                  {entryType === 'consulting' ? (
                    <>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Ticket">Ticket</SelectItem>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                      <SelectItem value="Ticket">Ticket</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {entryType === 'consulting' && (
              <div>
                <Label htmlFor="ticketOrOppNumber" className="text-[#0a1628]">Ticket #/Opp #</Label>
                <Input
                  id="ticketOrOppNumber"
                  type="number"
                  {...register("ticketOrOppNumber", { valueAsNumber: true })}
                  placeholder="12345"
                  className="border-gray-300 focus:border-[#0a1628]"
                />
              </div>
            )}

            {entryType === 'expense' && (
              <>
                <div>
                  <Label htmlFor="cwIdentifier" className="text-[#0a1628]">CW - Identifier</Label>
                  <Input
                    id="cwIdentifier"
                    {...register("cwIdentifier")}
                    placeholder="Identifier"
                    className="border-gray-300 focus:border-[#0a1628]"
                  />
                </div>

                <div>
                  <Label htmlFor="reimbursementEntryType" className="text-[#0a1628]">Entry Type</Label>
                  <Select onValueChange={(value) => setValue("reimbursementEntryType", value as any)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select entry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expense Reimbursement">Expense Reimbursement</SelectItem>
                      <SelectItem value="Billable Hours">Billable Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-white/95 backdrop-blur">
          <CardHeader className="bg-[#0a1628] border-b border-gray-700">
            <CardTitle className="text-white">Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="clientHourlyRate" className="text-[#0a1628]">Client Hourly Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="clientHourlyRate"
                  type="number"
                  step="0.01"
                  {...register("clientHourlyRate", { valueAsNumber: true })}
                  placeholder="150.00"
                  className="pl-7 border-gray-300 focus:border-[#0a1628]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="billableTimeHrs" className="text-[#0a1628]">Billable Time (Hrs.)</Label>
              <Input
                id="billableTimeHrs"
                type="number"
                step="0.25"
                {...register("billableTimeHrs", { valueAsNumber: true })}
                placeholder="8.5"
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>

            <div>
              <Label htmlFor="amountDue" className="text-[#0a1628] font-bold">Amount Due (Calculated)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="amountDue"
                  type="number"
                  step="0.01"
                  {...register("amountDue", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="pl-7 border-[#0a1628] bg-gray-50 font-bold text-lg"
                  readOnly
                />
              </div>
            </div>

            <div>
              <Label htmlFor="commissionRate" className="text-[#0a1628]">Commission Rate (%)</Label>
              <div className="relative">
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  {...register("commissionRate", { valueAsNumber: true })}
                  placeholder="35"
                  className="pr-7 border-gray-300 focus:border-[#0a1628]"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-white/95 backdrop-blur">
          <CardHeader className="bg-[#0a1628] border-b border-gray-700">
            <CardTitle className="text-white">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="dateExpected" className="text-[#0a1628]">Date Expected</Label>
              <Input
                id="dateExpected"
                type="date"
                {...register("dateExpected")}
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-white/95 backdrop-blur">
          <CardHeader className="bg-[#0a1628] border-b border-gray-700">
            <CardTitle className="text-white">TWC Tracking</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="twcInvoiceNumber" className="text-[#0a1628]">TWC Invoice #</Label>
              <Input
                id="twcInvoiceNumber"
                {...register("twcInvoiceNumber")}
                placeholder="TWC-12345"
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>

            <div>
              <Label htmlFor="twcInvoiceSentDate" className="text-[#0a1628]">TWC Invoice Sent Date</Label>
              <Input
                id="twcInvoiceSentDate"
                type="date"
                {...register("twcInvoiceSentDate")}
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>

            <div>
              <Label htmlFor="twcInvoicePaidDate" className="text-[#0a1628]">TWC Invoice Paid Date</Label>
              <Input
                id="twcInvoicePaidDate"
                type="date"
                {...register("twcInvoicePaidDate")}
                className="border-gray-300 focus:border-[#0a1628]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || success}
            className="bg-[#0a1628] hover:bg-[#1a2638] text-white font-bold shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Created!
              </>
            ) : (
              'Create Invoice'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
