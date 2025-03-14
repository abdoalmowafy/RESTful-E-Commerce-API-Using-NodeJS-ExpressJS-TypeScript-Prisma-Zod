import { z } from 'zod';
import { PromoCodeSchema } from './generated/zod';

export const ExtendedPromoCodeSchema = PromoCodeSchema.extend({
  code: z.string().min(5, "Promo code must be at least 5 characters long"),
  discountPercent: z.number().min(0).max(100, "Discount percent must be between 0 and 100"),
  validUntil: z.coerce.date().refine(date => date > new Date(), "Valid until date must be in the future"),
});

export type ExtendedPromoCode = z.infer<typeof ExtendedPromoCodeSchema>;