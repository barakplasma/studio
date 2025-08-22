'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatElapsedTime } from '@/lib/utils';
import { Hourglass, Repeat } from 'lucide-react';

type AnalyticsDisplayProps = {
  movingAverageDuration: number;
  movingAverageStartTimeDifference: number;
};

export default function AnalyticsDisplay({ movingAverageDuration, movingAverageStartTimeDifference }: AnalyticsDisplayProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Last Hour Analytics</CardTitle>
        <CardDescription>
          Moving averages for sessions started in the last 60 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
           <div className="flex items-center text-muted-foreground text-sm mb-2">
             <Hourglass className="mr-2 h-4 w-4" />
             <span>Avg. Duration</span>
           </div>
           <div className="text-2xl font-bold font-mono tabular-nums">
             {formatElapsedTime(movingAverageDuration)}
           </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center text-muted-foreground text-sm mb-2">
                <Repeat className="mr-2 h-4 w-4" />
                <span>Avg. Time Between Starts</span>
            </div>
           <div className="text-2xl font-bold font-mono tabular-nums">
             {formatElapsedTime(movingAverageStartTimeDifference)}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
