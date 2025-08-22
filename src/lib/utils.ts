import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Timestamp } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatElapsedTime(seconds: number): string {
  if (seconds < 0 || !isFinite(seconds)) seconds = 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds * 1000) % 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0').slice(0, 2)}`;
}

export type Session = {
  start_datetime: string;
  duration_seconds: number;
};

export function timestampsToSessions(timestamps: Timestamp[]): Session[] {
  let sessions: Session[] = [];
  let lastStartTime: Date | null = null;

  for (const ts of timestamps) {
    if (ts.type === 'start') {
      if (lastStartTime) {
        // Handle case of a start event before a stop event for the previous session.
        // Decide if this should be an "incomplete" session or ignored.
        // For now, we just overwrite the last start time.
      }
      lastStartTime = new Date(ts.time);
    } else if (ts.type === 'stop' && lastStartTime) {
      const stopTime = new Date(ts.time);
      const duration = (stopTime.getTime() - lastStartTime.getTime()) / 1000;
      sessions.push({
        start_datetime: lastStartTime.toISOString(),
        duration_seconds: duration,
      });
      lastStartTime = null; // Reset for the next pair
    }
  }

  return sessions;
}


export function timestampsToCsv(timestamps: Timestamp[]): string {
  const header = 'start_datetime,duration_seconds\n';
  const sessions = timestampsToSessions(timestamps);
  const rows = sessions.map(session => `"${session.start_datetime}",${session.duration_seconds}`);
  return header + rows.join('\n');
}

export function calculateMovingAverageDuration(timestamps: Timestamp[]): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const sessions = timestampsToSessions(timestamps);
    
    const recentSessions = sessions.filter(s => new Date(s.start_datetime) > oneHourAgo);
    
    if (recentSessions.length === 0) {
        return 0;
    }
    
    const totalDuration = recentSessions.reduce((acc, s) => acc + s.duration_seconds, 0);
    return totalDuration / recentSessions.length;
}

export function calculateMovingAverageStartTimeDifference(timestamps: Timestamp[]): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const startTimestamps = timestamps
        .filter(ts => ts.type === 'start' && new Date(ts.time) > oneHourAgo)
        .map(ts => new Date(ts.time))
        .sort((a, b) => a.getTime() - b.getTime());

    if (startTimestamps.length < 2) {
        return 0;
    }
    
    const differences: number[] = [];
    for (let i = 1; i < startTimestamps.length; i++) {
        const diff = (startTimestamps[i].getTime() - startTimestamps[i-1].getTime()) / 1000;
        differences.push(diff);
    }
    
    const totalDifference = differences.reduce((acc, diff) => acc + diff, 0);
    return totalDifference / differences.length;
}
