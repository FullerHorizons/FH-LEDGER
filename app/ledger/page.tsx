"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { BarChart3, Clock, Receipt, FileCheck } from "lucide-react";
import { TimeEntryForm } from "@/components/TimeEntryForm";
import { ExpenseEntryForm } from "@/components/ExpenseEntryForm";

export default function Ledger() {
  const [showTimeEntry, setShowTimeEntry] = useState(false);
  const [showExpenseEntry, setShowExpenseEntry] = useState(false);

  const actions = [
    {
      title: "FINANCE DASHBOARD",
      icon: BarChart3,
      disabled: true,
      onClick: () => {},
    },
    {
      title: "CREATE TIME ENTRY",
      icon: Clock,
      disabled: false,
      onClick: () => setShowTimeEntry(true),
    },
    {
      title: "CREATE EXPENSE ENTRY",
      icon: Receipt,
      disabled: false,
      onClick: () => setShowExpenseEntry(true),
    },
    {
      title: "VIEW / APPROVE FH INVOICES",
      icon: FileCheck,
      disabled: true,
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation pageTitle="LEDGER" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex justify-center mb-8 sm:mb-12">
          <Image
            src="/fh_logo_-_full.png"
            alt="Fuller Horizons"
            width={400}
            height={200}
            className="w-full max-w-xs sm:max-w-md h-auto"
            priority
          />
        </div>

        <h2 className="text-2xl sm:text-3xl text-center text-[var(--fh-navy)] mb-8 sm:mb-12 tracking-wider">
          LEDGER
        </h2>

        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {actions.map((action) => {
              const Icon = action.icon;
              const buttonContent = (
                <Button
                  size="lg"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`w-full h-auto py-8 px-6 flex flex-col items-center space-y-4 text-base sm:text-lg ${
                    action.disabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                      : "bg-[var(--fh-navy)] hover:bg-[var(--fh-navy)]/90 text-white"
                  }`}
                >
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                  <span className="font-normal tracking-wider text-center leading-tight">
                    {action.title}
                  </span>
                </Button>
              );

              if (action.disabled) {
                return (
                  <Tooltip key={action.title}>
                    <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                    <TooltipContent>
                      <p>Coming soon</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={action.title}>{buttonContent}</div>;
            })}
          </div>
        </TooltipProvider>
      </main>

      <TimeEntryForm
        open={showTimeEntry}
        onOpenChange={setShowTimeEntry}
      />
      <ExpenseEntryForm
        open={showExpenseEntry}
        onOpenChange={setShowExpenseEntry}
      />
    </div>
  );
}
