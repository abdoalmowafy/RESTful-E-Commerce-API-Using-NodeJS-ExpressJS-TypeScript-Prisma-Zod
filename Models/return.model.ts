import { z } from 'zod';
import { ReturnSchema } from './generated/zod';

export const ExtendedReturnSchema = ReturnSchema.extend({
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
});

export type ExtendedReturn = z.infer<typeof ExtendedReturnSchema>;