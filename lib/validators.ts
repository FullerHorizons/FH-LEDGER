import { z } from "zod";

export const consultingEntrySchema = z.object({
  entryType: z.literal('consulting'),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  ticketOrOppNumber: z.number().optional(),
  cwCategory: z.enum(['Project', 'Ticket', 'Opportunity']).optional(),
  cwClientName: z.string().optional(),
  category: z.enum(['Consulting', 'Sales', 'Project Management']).optional(),
  billableTimeHrs: z.number().min(0).optional(),
  clientHourlyRate: z.number().min(0).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  amountDue: z.number().optional(),
  dateSubmitted: z.string().optional(),
  datePerformed: z.string().optional(),
  dateExpected: z.string().optional(),
  twcInvoiceNumber: z.string().optional(),
  twcInvoiceSentDate: z.string().optional(),
  twcInvoicePaidDate: z.string().optional(),
});

export const expenseEntrySchema = z.object({
  entryType: z.literal('expense'),
  jrfInvoiceNumber: z.string().min(1, "JRF invoice number is required"),
  reimbursementEntryType: z.enum(['Expense Reimbursement', 'Billable Hours']).optional(),
  cwCategory: z.enum(['Project', 'Ticket', 'Opportunity']).optional(),
  cwClientName: z.string().optional(),
  cwIdentifier: z.string().optional(),
  category: z.enum(['Consulting', 'Sales', 'Networking', 'Project Management']).optional(),
  billableTimeHrs: z.number().min(0).optional(),
  clientHourlyRate: z.number().min(0).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  amountDue: z.number().optional(),
  dateSubmitted: z.string().optional(),
  datePerformed: z.string().optional(),
  dateExpected: z.string().optional(),
  twcInvoiceNumber: z.string().optional(),
  twcInvoiceSentDate: z.string().optional(),
  twcInvoicePaidDate: z.string().optional(),
});

export const invoiceFormSchema = z.discriminatedUnion('entryType', [
  consultingEntrySchema,
  expenseEntrySchema,
]);

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
