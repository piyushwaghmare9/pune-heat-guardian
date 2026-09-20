"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <div className="h-16 w-16 bg-surface-muted rounded-full flex items-center justify-center mb-6">
        <Leaf className="h-8 w-8 text-muted-foreground opacity-50" />
      </div>
      <h2 className="text-3xl font-bold mb-2">404</h2>
      <h3 className="text-xl font-medium mb-4">Region Not Found</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the environmental data or page you were looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
