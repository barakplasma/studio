import type { Timestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatElapsedTime, timestampsToSessionsWithIdleTime } from '@/lib/utils';
import { Repeat, Timer } from 'lucide-react';
import React from 'react';

type TimestampListProps = {
  timestamps: Timestamp[];
};

export default function TimestampList({ timestamps }: TimestampListProps) {
    const sessionsWithIdleTime = timestampsToSessionsWithIdleTime(timestamps);

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
                  <TableHead className="w-[200px]">Start Time (Your Local)</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...sessionsWithIdleTime].reverse().map((item, index) => (
                    <React.Fragment key={index}>
                        <TableRow>
                            <TableCell className="font-mono text-xs md:text-sm">
                                {new Date(item.session.start_datetime).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono text-sm md:text-base text-right tabular-nums">
                                <div className="flex items-center justify-end gap-2">
                                    <Timer className="h-4 w-4 text-muted-foreground" />
                                    {formatElapsedTime(item.session.duration_seconds)}
                                </div>
                            </TableCell>
                        </TableRow>
                        {item.idleTimeSeconds !== null && (
                             <TableRow>
                                <TableCell colSpan={2} className="py-2 px-4">
                                     <div className="flex items-center justify-center text-xs text-muted-foreground gap-2">
                                        <Repeat className="h-3 w-3"/>
                                        <span>Time between starts:</span>
                                        <span className="font-mono tabular-nums">{formatElapsedTime(item.idleTimeSeconds)}</span>
                                     </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
