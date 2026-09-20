import React from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-surface-muted/50 pt-16 pb-12 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Leaf className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                HeatGuard AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Empowering Pune with high-resolution urban heat intelligence, AI-assisted native plantation planning, and verifiable climate action tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>Monitoring 10 Key Pune Wards &amp; Urban Zones</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard Overview</Link></li>
              <li><Link href="/map" className="hover:text-foreground transition-colors">Pune Heat Map</Link></li>
              <li><Link href="/ai" className="hover:text-foreground transition-colors">AI Recommendations</Link></li>
              <li><Link href="/plantation" className="hover:text-foreground transition-colors">Plantation Planner</Link></li>
              <li><Link href="/impact" className="hover:text-foreground transition-colors">Impact Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Ecosystem</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/action" className="hover:text-foreground transition-colors">Action Registry</Link></li>
              <li><Link href="/community" className="hover:text-foreground transition-colors">NGOs &amp; Community</Link></li>
              <li><Link href="/vendors" className="hover:text-foreground transition-colors">Native Nurseries</Link></li>
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Citizen Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Knowledge</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#problem" className="hover:text-foreground transition-colors">The Heat Problem</Link></li>
              <li><Link href="/#solution" className="hover:text-foreground transition-colors">AI &amp; Cooling Solution</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">5-Step Process</Link></li>
              <li><Link href="/#impact" className="hover:text-foreground transition-colors">Target Goals 2030</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HeatGuard AI. Built for sustainable urban futures in Pune, India.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/#problem" className="hover:text-foreground transition-colors">Climate Methodology</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
