import type { Timestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type TimestampListProps = {
  timestamps: Timestamp[];
};

export default function TimestampList({ timestamps }: TimestampListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Timestamps</CardTitle>
        <CardDescription>
          A log of all start and stop events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timestamps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No timestamps recorded yet.</p>
            <p className="text-sm">Start the timer to begin logging.</p>
          </div>
        ) : (
          <ScrollArea className="h-60 md:h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Event</TableHead>
                  <TableHead>Timestamp (ISO 8601)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...timestamps].reverse().map((ts, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant={ts.type === 'start' ? 'secondary' : 'outline'}>
                        {ts.type.charAt(0).toUpperCase() + ts.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{ts.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
