'use client';

import { formatElapsedTime } from '@/lib/utils';
import { memo } from 'react';

type TimerDisplayProps = {
  elapsedTime: number;
};

const TimerDisplay = ({ elapsedTime }: TimerDisplayProps) => {
  return (
    <div className="font-mono text-5xl sm:text-6xl md:text-8xl text-center tracking-tighter text-foreground tabular-nums">
      {formatElapsedTime(elapsedTime)}
    </div>
  );
};

export default memo(TimerDisplay);
