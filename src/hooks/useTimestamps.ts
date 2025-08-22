'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Timestamp } from '@/lib/types';
import { TimestampSchema } from '@/lib/types';

const LOCAL_STORAGE_KEY = 'chrono-share-timestamps';

export function useTimestamps() {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);

  useEffect(() => {
    try {
      const savedTimestamps = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTimestamps) {
        const parsedTimestamps = JSON.parse(savedTimestamps);
        const validationResult = TimestampSchema.array().safeParse(parsedTimestamps);
        if (validationResult.success) {
          setTimestamps(validationResult.data);
        } else {
          console.error("Invalid timestamp data in local storage:", validationResult.error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load timestamps from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timestamps));
    } catch (error) {
      console.error("Failed to save timestamps to local storage:", error);
    }
  }, [timestamps]);
  
  const addTimestamp = useCallback((type: 'start' | 'stop') => {
    const newTimestamp: Timestamp = {
      type,
      time: new Date().toISOString(),
    };
    setTimestamps((prev) => [...prev, newTimestamp]);
  }, []);

  const resetTimestamps = useCallback(() => {
    setTimestamps([]);
  }, []);

  return { timestamps, addTimestamp, resetTimestamps };
}
