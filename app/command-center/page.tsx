"use client";

import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Lightbulb,
  Calendar,
  Users,
  Target,
  FolderOpen,
  DollarSign,
} from "lucide-react";

export default function CommandCenter() {
  const router = useRouter();

  const actions = [
    {
      title: "BRAIN DUMP",
      path: "/brain-dump",
      icon: Lightbulb,
      description: "Capture thoughts and ideas",
    },
    {
      title: "CALENDAR",
      path: "/calendar",
      icon: Calendar,
      description: "Schedule and events",
    },
    {
      title: "COMPANY / CONTACT DATABASE",
      path: "/contacts",
      icon: Users,
      description: "Manage contacts",
    },
    {
      title: "S.T.O.P.S.",
      path: "/stops",
      icon: Target,
      description: "Strategic tracking",
    },
    {
      title: "OPEN PROJECTS",
      path: "/projects",
      icon: FolderOpen,
      description: "Project management",
    },
    {
      title: "LEDGER",
      path: "/ledger",
      icon: DollarSign,
      description: "Financial management",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation pageTitle="COMMAND CENTER" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                onClick={() => router.push(action.path)}
                className="p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-[var(--fh-navy)] bg-white group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-[var(--fh-navy)]/5 group-hover:bg-[var(--fh-navy)]/10 transition-colors">
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-[var(--fh-navy)]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-normal text-[var(--fh-navy)] tracking-wider">
                    {action.title}
                  </h2>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
