// src/ai/flows/generate-shareable-url.ts
'use server';

/**
 * @fileOverview Generates a shareable URL for timer data, using AI to determine relevant information to include.
 *
 * - generateShareableUrl - A function that generates the shareable URL.
 * - GenerateShareableUrlInput - The input type for the generateShareableUrl function.
 * - GenerateShareableUrlOutput - The return type for the generateShareableUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShareableUrlInputSchema = z.object({
  startTimestamps: z.array(z.string()).describe('Array of ISO8601 start timestamps.'),
  stopTimestamps: z.array(z.string()).describe('Array of ISO8601 stop timestamps.'),
});
export type GenerateShareableUrlInput = z.infer<typeof GenerateShareableUrlInputSchema>;

const GenerateShareableUrlOutputSchema = z.object({
  shareableUrl: z.string().describe('The generated shareable URL.'),
});
export type GenerateShareableUrlOutput = z.infer<typeof GenerateShareableUrlOutputSchema>;

export async function generateShareableUrl(input: GenerateShareableUrlInput): Promise<GenerateShareableUrlOutput> {
  return generateShareableUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShareableUrlPrompt',
  input: {schema: GenerateShareableUrlInputSchema},
  output: {schema: GenerateShareableUrlOutputSchema},
  prompt: `You are a URL generator for a timer application. Given the start and stop timestamps, determine the most relevant information to include in a shareable URL. The URL should be concise but informative.

Start Timestamps: {{{startTimestamps}}}
Stop Timestamps: {{{stopTimestamps}}}

Return a shareable URL that includes the relevant timer data:
`,
});

const generateShareableUrlFlow = ai.defineFlow(
  {
    name: 'generateShareableUrlFlow',
    inputSchema: GenerateShareableUrlInputSchema,
    outputSchema: GenerateShareableUrlOutputSchema,
  },
  async input => {
    // Basic implementation: simply encode the data as a query string.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Use an environment variable for the base URL
    const startTimestampsParam = encodeURIComponent(JSON.stringify(input.startTimestamps));
    const stopTimestampsParam = encodeURIComponent(JSON.stringify(input.stopTimestamps));

    const shareableUrl = `${baseUrl}/shared?start=${startTimestampsParam}&stop=${stopTimestampsParam}`;
    return {shareableUrl};
  }
);
