'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useTimestamps } from '@/hooks/useTimestamps';
import { calculateMovingAverageDuration, calculateMovingAverageStartTimeDifference, cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import TimestampList from './TimestampList';
import { ExportMenu } from './ExportMenu';
import AnalyticsDisplay from './AnalyticsDisplay';

export default function ChronoShareApp() {
  const { isActive, elapsedTime, startTimer, stopTimer, resetTimer } = useTimer();
  const { timestamps, addTimestamp, resetTimestamps, deleteSession } = useTimestamps();
  
  const [movingAverageDuration, setMovingAverageDuration] = useState(0);
  const [movingAverageStartTimeDifference, setMovingAverageStartTimeDifference] = useState(0);

  useEffect(() => {
    setMovingAverageDuration(calculateMovingAverageDuration(timestamps));
    setMovingAverageStartTimeDifference(calculateMovingAverageStartTimeDifference(timestamps));
  }, [timestamps]);

  const handleToggle = useCallback(() => {
    if (isActive) {
      stopTimer();
      addTimestamp('stop');
    } else {
      startTimer();
      addTimestamp('start');
    }
  }, [isActive, startTimer, stopTimer, addTimestamp]);

  const handleReset = () => {
    resetTimer();
    resetTimestamps();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ChronoShare</h1>
        <p className="text-muted-foreground">Simple, persistent, shareable timer.</p>
      </div>

      <Card className="w-full shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <TimerDisplay elapsedTime={elapsedTime} />
          <Button
            onClick={handleToggle}
            className={cn(
              "w-full h-14 sm:h-16 text-xl sm:text-2xl font-bold rounded-xl transition-all duration-300 transform active:scale-95",
              isActive ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground'
            )}
          >
            {isActive ? <Square className="mr-3 h-7 w-7 sm:h-8 sm:w-8" /> : <Play className="mr-3 h-7 w-7 sm:h-8 sm:w-8" />}
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

      <TimestampList timestamps={timestamps} deleteSession={deleteSession} />
    </div>
  );
}
