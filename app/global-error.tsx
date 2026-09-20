"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Fatal global rendering error", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Critical System Error</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>HeatGuard AI encountered a fatal initialization error.</p>
          <button 
            onClick={() => reset()}
            style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
