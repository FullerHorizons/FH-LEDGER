import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const CONSULTING_DATABASE_ID = "ebc910eed9b04b94a630ed2047589ab9";
export const EXPENSE_DATABASE_ID = "2c694b016c9d80e498c2eac009fe5c91";

export async function getLastInvoiceNumber(): Promise<string | null> {
  try {
    const response: any = await (notion.databases as any).query({
      database_id: CONSULTING_DATABASE_ID,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
      page_size: 1,
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    if ("properties" in page) {
      const titleProp = page.properties["Invoice #"];
      if (titleProp.type === "title" && titleProp.title.length > 0) {
        return titleProp.title[0].plain_text;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching last invoice number:", error);
    return null;
  }
}

export function generateNextInvoiceNumber(lastInvoice: string | null): string {
  const year = new Date().getFullYear();
  const prefix = `FH-${year}-`;

  if (!lastInvoice || !lastInvoice.startsWith(prefix)) {
    return `${prefix}0001`;
  }

  const lastNumber = parseInt(lastInvoice.split("-")[2], 10);
  const nextNumber = lastNumber + 1;
  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}
