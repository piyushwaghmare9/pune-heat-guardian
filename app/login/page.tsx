"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { Leaf, ShieldCheck, Users, User, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLoginWithCreds = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        router.push(callbackUrl);
      } else {
        setError(data.error || "Failed to login");
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginWithCreds(email, password);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    handleLoginWithCreds(demoEmail, "password123");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md shadow-lg border border-border/80 bg-surface rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">Welcome to HeatGuard AI</CardTitle>
          <CardDescription className="text-xs">
            Sign in to access Pune&apos;s climate intelligence platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Quick 1-Click Demo Accounts Banner */}
          <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Quick 1-Click Demo Logins</span>
              <span className="text-primary font-normal">Pre-authenticated</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@heatguard.ai")}
                disabled={isLoading}
                className="flex flex-col items-center p-2 rounded-lg border border-border bg-surface hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-warning mb-1" />
                <span className="text-xs font-bold text-foreground">Admin</span>
                <span className="text-[10px] text-muted-foreground">Full console</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("contact@punegreenbrigade.org")}
                disabled={isLoading}
                className="flex flex-col items-center p-2 rounded-lg border border-border bg-surface hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer"
              >
                <Users className="h-4 w-4 text-secondary mb-1" />
                <span className="text-xs font-bold text-foreground">NGO Lead</span>
                <span className="text-[10px] text-muted-foreground">Coordinator</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("jane.citizen@example.com")}
                disabled={isLoading}
                className="flex flex-col items-center p-2 rounded-lg border border-border bg-surface hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer"
              >
                <User className="h-4 w-4 text-primary mb-1" />
                <span className="text-xs font-bold text-foreground">Citizen</span>
                <span className="text-[10px] text-muted-foreground">Community</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="danger" className="text-xs py-2">
                {error}
              </Alert>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@heatguard.ai" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
            
            <Button type="submit" className="w-full h-10 gap-2 shadow-xs" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{isLoading ? "Signing in..." : "Sign in to Dashboard"}</span>
              {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
