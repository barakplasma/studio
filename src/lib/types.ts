import { z } from 'zod';

export const TimestampSchema = z.object({
  type: z.enum(['start', 'stop']),
  time: z.string().datetime(),
});

export type Timestamp = z.infer<typeof TimestampSchema>;

export const SessionSchema = z.object({
  start_datetime: z.string().datetime(),
  duration_seconds: z.number(),
});

export type Session = z.infer<typeof SessionSchema>;
