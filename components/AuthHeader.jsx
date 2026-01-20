"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthHeader() {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status === "authenticated") {
    return (
      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button className="bg-background hover:bg-purple-600 text-cyan-200 hover:text-white">
        Login
      </Button>
    </Link>
  );
}
