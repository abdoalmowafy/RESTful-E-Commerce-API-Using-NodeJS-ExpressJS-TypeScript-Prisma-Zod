import { z } from 'zod';
import { CartSchema } from './generated/zod';

export const ExtendedCartSchema = CartSchema.extend({
  promoCodeId: z.string().uuid().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullish(),
});

export type ExtendedCart = z.infer<typeof ExtendedCartSchema>;