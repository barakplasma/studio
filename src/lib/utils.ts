import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Timestamp } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatElapsedTime(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds * 1000) % 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0').slice(0, 2)}`;
}

export function timestampsToCsv(timestamps: Timestamp[]): string {
  const header = 'start_datetime,duration_seconds\n';
  let rows = [];
  let lastStartTime: Date | null = null;

  for (const ts of timestamps) {
    if (ts.type === 'start') {
      lastStartTime = new Date(ts.time);
    } else if (ts.type === 'stop' && lastStartTime) {
      const stopTime = new Date(ts.time);
      const duration = (stopTime.getTime() - lastStartTime.getTime()) / 1000;
      rows.push(`"${lastStartTime.toISOString()}",${duration}`);
      lastStartTime = null; // Reset for the next pair
    }
  }

  return header + rows.join('\n');
}