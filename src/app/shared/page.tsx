import { redirect } from 'next/navigation';
import TimestampList from '@/components/TimestampList';
import type { Timestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <Card className="w-full max-w-md">
      <CardHeader className="items-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <CardTitle className="text-destructive">Invalid Link</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Create your own timer
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default function SharedPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const startParam = searchParams?.start;
  const stopParam = searchParams?.stop;

  if (!startParam || !stopParam) {
    return <ErrorDisplay message="Shared data is missing or incomplete. Please check the URL." />;
  }
  
  let parsedStarts: string[] = [];
  let parsedStops: string[] = [];

  try {
    const decodedStart = decodeURIComponent(Array.isArray(startParam) ? startParam[0] : startParam);
    const decodedStop = decodeURIComponent(Array.isArray(stopParam) ? stopParam[0] : stopParam);
    
    parsedStarts = JSON.parse(decodedStart);
    parsedStops = JSON.parse(decodedStop);

    if (!Array.isArray(parsedStarts) || !Array.isArray(parsedStops)) {
      throw new Error("Data is not in the correct format.");
    }

  } catch (error) {
    console.error("Failed to parse shared data:", error);
    return <ErrorDisplay message="Could not read the shared data. The URL may be corrupted." />;
  }

  const timestamps: Timestamp[] = [
    ...parsedStarts.map((time): Timestamp => ({ type: 'start', time })),
    ...parsedStops.map((time): Timestamp => ({ type: 'stop', time })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">ChronoShare</h1>
          <p className="text-muted-foreground">A shared timer session</p>
        </div>
        <TimestampList timestamps={timestamps} />
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Create your own timer
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
