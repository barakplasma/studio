'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Timestamp } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateMovingAverageDuration, calculateMovingAverageStartTimeDifference } from '@/lib/utils';

import TimerDisplay from './TimerDisplay';
import TimestampList from './TimestampList';
import { ExportMenu } from './ExportMenu';
import AnalyticsDisplay from './AnalyticsDisplay';


const LOCAL_STORAGE_KEY = 'chrono-share-timestamps';

export default function ChronoShareApp() {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [movingAverageDuration, setMovingAverageDuration] = useState(0);
  const [movingAverageStartTimeDifference, setMovingAverageStartTimeDifference] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedTimestamps = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTimestamps) {
        const parsedTimestamps: Timestamp[] = JSON.parse(savedTimestamps);
        setTimestamps(parsedTimestamps);
      }
    } catch (error) {
      console.error("Failed to load timestamps from local storage:", error);
    }
  }, []);

  // Save to local storage and update analytics on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timestamps));
      setMovingAverageDuration(calculateMovingAverageDuration(timestamps));
      setMovingAverageStartTimeDifference(calculateMovingAverageStartTimeDifference(timestamps));
    } catch (error) {
      console.error("Failed to save timestamps or calculate analytics:", error);
    }
  }, [timestamps]);

  const startTimer = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    lastUpdateTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateTimeRef.current) / 1000;
      setElapsedTime((prev) => prev + delta);
      lastUpdateTimeRef.current = now;
    }, 10); // Update every 10ms for smooth display
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = Date.now();
    const delta = (now - lastUpdateTimeRef.current) / 1000;
    setElapsedTime((prev) => prev + delta);
  }, []);

  const handleToggle = useCallback(() => {
    const newTimestamp: Timestamp = {
      type: isActive ? 'stop' : 'start',
      time: new Date().toISOString(),
    };
    setTimestamps((prev) => [...prev, newTimestamp]);

    if (isActive) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [isActive, startTimer, stopTimer]);

  const handleReset = () => {
    stopTimer();
    setElapsedTime(0);
    setTimestamps([]);
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">ChronoShare</h1>
        <p className="text-muted-foreground">Simple, persistent, shareable timer.</p>
      </div>

      <Card className="w-full shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <TimerDisplay elapsedTime={elapsedTime} />
          <Button
            onClick={handleToggle}
            className={cn(
              "w-full h-16 text-2xl font-bold rounded-xl transition-all duration-300 transform active:scale-95",
              isActive ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground'
            )}
          >
            {isActive ? <Square className="mr-3 h-8 w-8" /> : <Play className="mr-3 h-8 w-8" />}
            {isActive ? 'Stop' : 'Start'}
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-2 w-full">
         <ExportMenu timestamps={timestamps} />
         <Button variant="destructive" onClick={handleReset} className="col-start-2" disabled={timestamps.length === 0 && elapsedTime === 0}>Reset</Button>
      </div>

      <AnalyticsDisplay 
        movingAverageDuration={movingAverageDuration}
        movingAverageStartTimeDifference={movingAverageStartTimeDifference}
      />

      <TimestampList timestamps={timestamps} />
    </div>
  );
}
