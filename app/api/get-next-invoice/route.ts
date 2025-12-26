import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getLastInvoiceNumber, generateNextInvoiceNumber } from "@/lib/notion-client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== "jonathan@fullerhorizons.net") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const lastInvoice = await getLastInvoiceNumber();
    const nextInvoice = generateNextInvoiceNumber(lastInvoice);

    return NextResponse.json({
      nextInvoiceNumber: nextInvoice,
    });
  } catch (error) {
    console.error("Error generating next invoice number:", error);
    return NextResponse.json(
      { message: "Failed to generate invoice number" },
      { status: 500 }
    );
  }
}
