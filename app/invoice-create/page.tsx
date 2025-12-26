"use client";

import { Header } from "@/components/Header";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function InvoiceCreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#162a42]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <InvoiceForm />
      </main>
    </div>
  );
}
