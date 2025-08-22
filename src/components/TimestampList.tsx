import type { Timestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatElapsedTime, timestampsToSessions, timestampsToSessionsWithIdleTime } from '@/lib/utils';
import { Edit, Repeat, Timer, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

type TimestampListProps = {
  timestamps: Timestamp[];
  deleteSession: (sessionIndex: number) => void;
};

export default function TimestampList({ timestamps, deleteSession }: TimestampListProps) {
    const sessionsWithIdleTime = timestampsToSessionsWithIdleTime(timestamps);
    const sessions = timestampsToSessions(timestamps);
    const reversedSessions = [...sessions].reverse();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Session Log</CardTitle>
        <CardDescription>
          A detailed log of all timer sessions and the time between them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessionsWithIdleTime.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No sessions recorded yet.</p>
            <p className="text-sm">Start and stop the timer to log a session.</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] sm:w-[200px]">Start Time (Your Local)</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...sessionsWithIdleTime].reverse().map((item, index) => {
                    const reversedIndex = sessionsWithIdleTime.length - 1 - index;
                    return (
                    <React.Fragment key={reversedIndex}>
                        <TableRow>
                            <TableCell className="font-mono text-xs">
                                {new Date(item.session.start_datetime).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-right tabular-nums">
                                <div className="flex items-center justify-end gap-2">
                                    <Timer className="h-4 w-4 text-muted-foreground" />
                                    {formatElapsedTime(item.session.duration_seconds)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteSession(reversedIndex)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        {item.idleTimeSeconds !== null && (
                             <TableRow>
                                <TableCell colSpan={3} className="py-2 px-4">
                                     <div className="flex items-center justify-center text-xs text-muted-foreground gap-2">
                                        <Repeat className="h-3 w-3"/>
                                        <span>Time between starts:</span>
                                        <span className="font-mono tabular-nums">{formatElapsedTime(item.idleTimeSeconds)}</span>
                                     </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                )})}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
