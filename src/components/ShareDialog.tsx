'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import type { Timestamp } from '@/lib/types';
import { generateShareableUrl } from '@/ai/flows/generate-shareable-url';

export function ShareDialog({ timestamps }: { timestamps: Timestamp[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateUrl = async () => {
    setIsLoading(true);
    setShareableUrl('');
    setIsCopied(false);

    try {
      const startTimestamps = timestamps.filter(t => t.type === 'start').map(t => t.time);
      const stopTimestamps = timestamps.filter(t => t.type === 'stop').map(t => t.time);
      
      const result = await generateShareableUrl({ startTimestamps, stopTimestamps });
      
      setShareableUrl(result.shareableUrl);

    } catch (error) {
      console.error("Failed to generate shareable URL:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate a shareable URL. Please try again.",
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Shareable URL has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={timestamps.length === 0} onClick={handleGenerateUrl}>
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Timer</DialogTitle>
          <DialogDescription>
            Copy the link below to share a read-only view of your timer data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="share-link" className="sr-only">
                Shareable Link
              </Label>
              <div className="flex items-center space-x-2">
                <Input id="share-link" value={shareableUrl} readOnly />
                <Button size="icon" onClick={handleCopyToClipboard} disabled={!shareableUrl}>
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
