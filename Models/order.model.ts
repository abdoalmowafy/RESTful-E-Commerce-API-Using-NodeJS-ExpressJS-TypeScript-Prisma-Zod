import { z } from 'zod';
import { OrderSchema, OrderWithRelationsSchema } from './generated/zod/index';

export const ExtendedOrderSchema = OrderSchema.extend({
  totalCents: z.number().int().positive(),
  currency: z.string().min(3).max(3),
});

export type ExtendedOrder = z.infer<typeof ExtendedOrderSchema>;