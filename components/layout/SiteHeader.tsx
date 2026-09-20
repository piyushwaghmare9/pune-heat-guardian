"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';
import { Button } from '@/components/ui/button';
import { Menu, Leaf, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const marketingNavItems = [
    { title: "The Problem", href: "/#problem" },
    { title: "Solution", href: "/#solution" },
    { title: "How It Works", href: "/#how-it-works" },
    { title: "Heat Map", href: "/map" },
    { title: "AI Planner", href: "/ai" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Leaf className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {marketingNavItems.map((item) => (
            <Link 
              key={item.title} 
              href={item.href} 
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}

          {user?.role === "ADMIN" && (
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-xs font-semibold text-warning hover:text-warning/80 bg-warning/10 px-2.5 py-1 rounded-full transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Desktop CTA / Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                  Explore Heat Map
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-surface p-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {marketingNavItems.map((item) => (
            <Link 
              key={item.title} 
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              {item.title}
            </Link>
          ))}
          
          {user?.role === "ADMIN" && (
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md text-sm font-medium text-warning bg-warning/10 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Console
            </Link>
          )}

          <div className="border-t pt-3 flex flex-col gap-2 mt-1">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Go to Dashboard</Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/map" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Explore Heat Map</Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
