"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (firebaseUser: FirebaseUser | null) => {
    try {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          role: (userData.role as Role) || "USER",
          status: userData.status || "ACTIVE",
          createdAt: userData.createdAt || new Date().toISOString(),
          organizationId: userData.organizationId,
          vendorId: userData.vendorId,
        });
      } else {
        // Fallback if profile doesn't exist yet (e.g. during signup)
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      await fetchUserProfile(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    await fetchUserProfile(auth.currentUser);
  };

  const logout = async () => {
    try {
      // 1. Sign out from Firebase Client Auth
      await signOut(auth);
      
      // 2. Clear the server-side session cookie
      await fetch("/api/v1/auth/logout", { method: "POST" });
      
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
