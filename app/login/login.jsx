"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,   
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const Login = () => {
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log({
      email: formData.get("email"),
      password: formData.get("password"),
    });
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
         
          <Button type="submit" className="w-full mt-5">
            Login
          </Button>
        </CardContent>
        
      </form>
    </Card>

  );
};
export default Login;