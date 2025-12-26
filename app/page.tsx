"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/invoice-create");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/fh_logo_-_full.png"
              alt="Fuller Horizons"
              width={400}
              height={300}
              className="w-auto h-48"
              priority
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => signIn("google", { prompt: "select_account" })}
            size="lg"
            className="bg-white hover:bg-gray-100 text-[#0a1628] px-8 py-6 text-lg shadow-lg font-semibold"
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  );
}
