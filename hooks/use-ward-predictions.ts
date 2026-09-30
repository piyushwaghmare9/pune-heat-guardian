/**
 * hooks/use-ward-predictions.ts
 * Data hook for fetching ML-predicted ward temperature summaries.
 * Provides loading, error, and fallback states.
 * Simple cache (Map) avoids re-fetching within the session.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { getWardPredictions } from "@/services/api";
import type { WardPredictionSummary } from "@/types/ml";

// Session-level cache — cleared on hard-reload
const _cache = new Map<string, WardPredictionSummary[]>();
const CACHE_KEY = "ward_predictions";

export interface UseWardPredictionsResult {
  predictions: WardPredictionSummary[];
  isLoading: boolean;
  isError: boolean;
  isFallback: boolean;
  refresh: () => void;
}

export function useWardPredictions(): UseWardPredictionsResult {
  const [predictions, setPredictions] = useState<WardPredictionSummary[]>(
    _cache.get(CACHE_KEY) ?? []
  );
  const [isLoading, setIsLoading] = useState(!_cache.has(CACHE_KEY));
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const refreshCounter = useRef(0);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    setIsFallback(false);
    try {
      const data = await getWardPredictions();
      if (data.length === 0) {
        // ML service returned empty — flag as fallback
        setIsFallback(true);
      } else {
        _cache.set(CACHE_KEY, data);
        setPredictions(data);
      }
    } catch {
      setIsError(true);
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (_cache.has(CACHE_KEY)) return; // serve from cache
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter.current]);

  const refresh = () => {
    _cache.delete(CACHE_KEY);
    refreshCounter.current += 1;
    fetchData();
  };

  return { predictions, isLoading, isError, isFallback, refresh };
}
