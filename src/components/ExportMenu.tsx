'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Timestamp } from "@/lib/types";
import { timestampsToCsv, timestampsToSessions } from "@/lib/utils";

export function ExportMenu({ timestamps }: { timestamps: Timestamp[] }) {
  const { toast } = useToast();

  const copyToClipboard = (content: string, format: 'JSON' | 'CSV') => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: `Timestamp data has been copied as ${format}.`,
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not copy data to clipboard.",
        });
      });
  };

  const handleCopyJson = () => {
    const sessions = timestampsToSessions(timestamps);
    const jsonString = JSON.stringify(sessions, null, 2);
    copyToClipboard(jsonString, 'JSON');
  };

  const handleCopyCsv = () => {
    const csvString = timestampsToCsv(timestamps);
    copyToClipboard(csvString, 'CSV');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={timestamps.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyJson}>
          Copy as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyCsv}>
          Copy as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
