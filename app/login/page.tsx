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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLoginWithCreds = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // 1. Sign in with Firebase Client Auth
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      
      // 2. Get the ID token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Send ID token to our backend to create a session cookie
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // useAuth's onAuthStateChanged will automatically pick up the user
        router.push(callbackUrl);
      } else {
        setError(data.error || "Failed to create session");
      }
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Ensure Firestore profile exists for Google users
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName || "Google User",
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        });
      }

      const idToken = await userCredential.user.getIdToken();
      
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push(callbackUrl);
      } else {
        setError(data.error || "Failed to create session");
      }
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "An unexpected error occurred with Google Sign-In.");
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
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-10 gap-2 bg-surface hover:bg-surface-muted" 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
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
