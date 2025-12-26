"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Home } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <Card className="max-w-md border-red-800 shadow-xl bg-white/95 backdrop-blur">
        <CardHeader className="bg-red-900 border-b border-red-800 text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-10 w-10" />
            <div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription className="text-red-100">
                Unauthorized Access
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-gray-700">
            Sorry, you do not have permission to access this application.
          </p>
          <p className="text-gray-600 text-sm">
            Only authorized Fuller Horizons personnel can access the invoice creation system.
            If you believe this is an error, please contact your administrator.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full bg-[#0a1628] hover:bg-[#1a2638] text-white">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
