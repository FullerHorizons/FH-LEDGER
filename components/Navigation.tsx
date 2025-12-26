"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";

interface NavigationProps {
  pageTitle: string;
}

export function Navigation({ pageTitle }: NavigationProps) {
  const router = useRouter();

  const menuItems = [
    { label: "Command Center", path: "/command-center" },
    { label: "Brain Dump", path: "/brain-dump" },
    { label: "Calendar", path: "/calendar" },
    { label: "Company/Contact Database", path: "/contacts" },
    { label: "S.T.O.P.S.", path: "/stops" },
    { label: "Open Projects", path: "/projects" },
    { label: "Ledger", path: "/ledger" },
  ];

  return (
    <nav className="fh-navy border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Image
              src="/fh_logo_-_full_-_tight.png"
              alt="FH"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="text-white text-lg sm:text-xl font-normal tracking-wider">
              {pageTitle}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 px-6"
              >
                <Menu className="h-5 w-5 mr-2" />
                Navigate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border-gray-200"
            >
              <DropdownMenuLabel className="text-fh-navy font-semibold">
                Navigation
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="cursor-pointer text-fh-navy hover:bg-gray-100 focus:bg-gray-100"
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
