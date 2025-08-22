'use client';

import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    setIsActive(true);
    setElapsedTime(0);
    lastUpdateTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateTimeRef.current) / 1000;
      setElapsedTime((prev) => prev + delta);
      lastUpdateTimeRef.current = now;
    }, 10);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = Date.now();
    if (lastUpdateTimeRef.current > 0) {
      const delta = (now - lastUpdateTimeRef.current) / 1000;
      setElapsedTime((prev) => prev + delta);
    }
  }, []);
  
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setElapsedTime(0);
  }, []);


  return { isActive, elapsedTime, startTimer, stopTimer, resetTimer };
}
