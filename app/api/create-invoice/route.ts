import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { invoiceFormSchema } from "@/lib/validators";
import { notion, CONSULTING_DATABASE_ID, EXPENSE_DATABASE_ID } from "@/lib/notion-client";

export const dynamic = 'force-dynamic';

async function sendMakeWebhook(data: any) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("Make.com webhook URL not configured");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to send webhook:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== "jonathan@fullerhorizons.net") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = invoiceFormSchema.parse(body);

    if (validatedData.entryType === "consulting") {
      const properties: any = {
        "Invoice #": {
          title: [
            {
              text: {
                content: validatedData.invoiceNumber,
              },
            },
          ],
        },
      };

      if (validatedData.ticketOrOppNumber) {
        properties["Ticket #/Opp #"] = {
          number: validatedData.ticketOrOppNumber,
        };
      }

      if (validatedData.cwCategory) {
        properties["CW - Category"] = {
          select: {
            name: validatedData.cwCategory,
          },
        };
      }

      if (validatedData.cwClientName) {
        properties["CW - Client Name"] = {
          rich_text: [
            {
              text: {
                content: validatedData.cwClientName,
              },
            },
          ],
        };
      }

      if (validatedData.category) {
        properties["Category"] = {
          select: {
            name: validatedData.category,
          },
        };
      }

      if (validatedData.billableTimeHrs !== undefined) {
        properties["Billable Time (Hrs.)"] = {
          number: validatedData.billableTimeHrs,
        };
      }

      if (validatedData.clientHourlyRate !== undefined) {
        properties["Client Hourly Rate"] = {
          number: validatedData.clientHourlyRate,
        };
      }

      if (validatedData.commissionRate !== undefined) {
        properties["Commission Rate (%)"] = {
          number: validatedData.commissionRate / 100,
        };
      }

      if (validatedData.amountDue !== undefined) {
        properties["Amount Due"] = {
          number: validatedData.amountDue,
        };
      }

      if (validatedData.dateSubmitted) {
        properties["Date Submitted"] = {
          date: {
            start: validatedData.dateSubmitted,
          },
        };
      }

      if (validatedData.datePerformed) {
        properties["Date Performed"] = {
          date: {
            start: validatedData.datePerformed,
          },
        };
      }

      if (validatedData.dateExpected) {
        properties["Date Expected"] = {
          date: {
            start: validatedData.dateExpected,
          },
        };
      }

      if (validatedData.twcInvoiceNumber) {
        properties["TWC Invoice #"] = {
          rich_text: [
            {
              text: {
                content: validatedData.twcInvoiceNumber,
              },
            },
          ],
        };
      }

      if (validatedData.twcInvoiceSentDate) {
        properties["TWC Invoice Sent Date"] = {
          date: {
            start: validatedData.twcInvoiceSentDate,
          },
        };
      }

      if (validatedData.twcInvoicePaidDate) {
        properties["TWC Invoice Paid Date"] = {
          date: {
            start: validatedData.twcInvoicePaidDate,
          },
        };
      }

      const response = await notion.pages.create({
        parent: {
          database_id: CONSULTING_DATABASE_ID,
        },
        properties,
      });

      await sendMakeWebhook({
        entryType: "consulting",
        pageId: response.id,
        properties: validatedData,
      });

      return NextResponse.json({
        message: "Consulting entry created successfully",
        data: {
          id: response.id,
        },
      });
    } else {
      const properties: any = {
        "": {
          title: [
            {
              text: {
                content: validatedData.jrfInvoiceNumber!,
              },
            },
          ],
        },
      };

      if (validatedData.reimbursementEntryType) {
        properties["Entry Type"] = {
          select: {
            name: validatedData.reimbursementEntryType,
          },
        };
      }

      if (validatedData.cwCategory) {
        properties["CW - Category"] = {
          select: {
            name: validatedData.cwCategory,
          },
        };
      }

      if (validatedData.cwClientName) {
        properties["CW - Client Name"] = {
          rich_text: [
            {
              text: {
                content: validatedData.cwClientName,
              },
            },
          ],
        };
      }

      if (validatedData.cwIdentifier) {
        properties["CW - Identifier"] = {
          rich_text: [
            {
              text: {
                content: validatedData.cwIdentifier,
              },
            },
          ],
        };
      }

      if (validatedData.category) {
        properties["Category"] = {
          select: {
            name: validatedData.category,
          },
        };
      }

      if (validatedData.billableTimeHrs !== undefined) {
        properties["Billable Time (Hrs.)"] = {
          number: validatedData.billableTimeHrs,
        };
      }

      if (validatedData.clientHourlyRate !== undefined) {
        properties["Client Hourly Rate"] = {
          number: validatedData.clientHourlyRate,
        };
      }

      if (validatedData.commissionRate !== undefined) {
        properties["Commission Rate (%)"] = {
          number: validatedData.commissionRate / 100,
        };
      }

      if (validatedData.amountDue !== undefined) {
        properties["Amount Due"] = {
          number: validatedData.amountDue,
        };
      }

      if (validatedData.dateSubmitted) {
        properties["Date Submitted"] = {
          date: {
            start: validatedData.dateSubmitted,
          },
        };
      }

      if (validatedData.datePerformed) {
        properties["Date Performed"] = {
          date: {
            start: validatedData.datePerformed,
          },
        };
      }

      if (validatedData.dateExpected) {
        properties["Date Expected"] = {
          date: {
            start: validatedData.dateExpected,
          },
        };
      }

      if (validatedData.twcInvoiceNumber) {
        properties["TWC Invoice #"] = {
          rich_text: [
            {
              text: {
                content: validatedData.twcInvoiceNumber,
              },
            },
          ],
        };
      }

      if (validatedData.twcInvoiceSentDate) {
        properties["TWC Invoice Sent Date"] = {
          date: {
            start: validatedData.twcInvoiceSentDate,
          },
        };
      }

      if (validatedData.twcInvoicePaidDate) {
        properties["TWC Invoice Paid Date"] = {
          date: {
            start: validatedData.twcInvoicePaidDate,
          },
        };
      }

      const response = await notion.pages.create({
        parent: {
          database_id: EXPENSE_DATABASE_ID,
        },
        properties,
      });

      await sendMakeWebhook({
        entryType: "expense",
        pageId: response.id,
        properties: validatedData,
      });

      return NextResponse.json({
        message: "Expense entry created successfully",
        data: {
          id: response.id,
        },
      });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 400 }
    );
  }
}
