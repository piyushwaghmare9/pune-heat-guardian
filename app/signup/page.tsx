"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { Leaf, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <Card className="w-full max-w-md shadow-lg border border-border/80 bg-surface rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Welcome to HeatGuard AI!</h2>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
              Your account has been registered. Redirecting to sign in...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md shadow-lg border border-border/80 bg-surface rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-xs">
            Join Pune&apos;s urban heat action &amp; reforestation network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <Alert variant="danger" className="text-xs py-2">
                {error}
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Account Role</Label>
              <select 
                className="flex h-10 w-full rounded-lg border border-border bg-surface-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="USER">Individual Citizen / Volunteer</option>
                <option value="ORGANIZATION">Organization / Environmental NGO</option>
                <option value="VENDOR">Certified Native Nursery / Vendor</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                {accountType === 'USER' ? 'Full Name' : 'Organization Name'}
              </Label>
              <Input 
                id="name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={accountType === 'USER' ? 'e.g. Priya Sharma' : 'e.g. Pune Green Foundation'}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-10 text-sm"
              />
            </div>
            
            <Button type="submit" className="w-full h-10 gap-2 shadow-xs mt-2">
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
