"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our standardized logger
    logger.error("Route-level rendering error", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred while loading this section of the platform. We've logged the issue.
      </p>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
