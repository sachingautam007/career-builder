"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      
    }
  }, [status, router]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password.");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (


    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold gradient-title">Login to Your Profile</CardTitle>
        <CardDescription>Login to access your personalized career insights</CardDescription>
      </CardHeader>


      <form className="space-y-5 mb-2" onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Enter your password" required />
            </div>
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full mt-5"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Link href="/signup">
            <Button variant="outline" className="w-full mt-3">
              Sign Up
            </Button>
          </Link>
        </CardContent>


      </form>
    </Card>

  );
};
export default Login;