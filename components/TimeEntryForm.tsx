"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const timeEntrySchema = z.object({
  datePerformed: z.date({ required_error: "Date is required" }),
  clientName: z.string().min(1, "Client name is required"),
  clientApprover: z.string().min(1, "Client approver is required"),
  workType: z.string().min(1, "Work type is required"),
  description: z.string().min(1, "Description is required"),
  billingMethod: z.enum(["Fixed Fee", "Hourly"]),
  fixedFeeAmount: z.string().optional(),
  billableHours: z.string().optional(),
  hourlyRate: z.string().optional(),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface TimeEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimeEntryForm({ open, onOpenChange }: TimeEntryFormProps) {
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TimeEntryFormData | null>(null);

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      billingMethod: "Hourly",
    },
  });

  const billingMethod = form.watch("billingMethod");

  const onSubmit = (data: TimeEntryFormData) => {
    setFormData(data);
    setShowReview(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_MAKE_TIME_WEBHOOK_URL;

      if (!webhookUrl) {
        toast.error("Webhook URL not configured. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        type: "time_entry",
        datePerformed: format(formData.datePerformed, "MM/dd/yyyy"),
        clientName: formData.clientName,
        clientApprover: formData.clientApprover,
        workType: formData.workType,
        description: formData.description,
        billingMethod: formData.billingMethod,
        ...(formData.billingMethod === "Fixed Fee"
          ? { fixedFeeAmount: formData.fixedFeeAmount }
          : {
              billableHours: formData.billableHours,
              hourlyRate: formData.hourlyRate,
            }),
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit");

      toast.success("Time entry submitted successfully!");
      form.reset();
      setShowReview(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit time entry. Please try again.");
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
              Review Time Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Date Performed</p>
                <p className="text-base">{format(formData.datePerformed, "MM/dd/yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Client Name</p>
                <p className="text-base">{formData.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Client Approver</p>
                <p className="text-base">{formData.clientApprover}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Work Type</p>
                <p className="text-base">{formData.workType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-600">Description</p>
                <p className="text-base">{formData.description}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Billing Method</p>
                <p className="text-base">{formData.billingMethod}</p>
              </div>
              {formData.billingMethod === "Fixed Fee" ? (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Fixed Fee Amount</p>
                  <p className="text-base">${formData.fixedFeeAmount}</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Billable Hours</p>
                    <p className="text-base">{formData.billableHours}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Hourly Rate</p>
                    <p className="text-base">${formData.hourlyRate}</p>
                  </div>
                </>
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
            Create Time Entry
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="datePerformed"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Performed</FormLabel>
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
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientApprover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Approver</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fixed Fee">Fixed Fee</SelectItem>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {billingMethod === "Fixed Fee" ? (
              <FormField
                control={form.control}
                name="fixedFeeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Fee Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="billableHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billable Time (Hours)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Hourly Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
