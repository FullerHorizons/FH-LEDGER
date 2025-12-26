"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-[#0a1628] text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo_-_background.png"
            alt="Fuller Horizons"
            width={50}
            height={50}
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-xl font-bold">Fuller Horizons</h1>
            <p className="text-xs text-gray-400">OWNER LOGIN</p>
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold">{session.user?.email}</p>
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="bg-transparent text-white border-gray-600 hover:bg-white/10 hover:text-white hover:border-gray-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
