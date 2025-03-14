import { z } from 'zod';
import { AddressSchema } from './generated/zod';

export const ExtendedAddressSchema = AddressSchema.extend({
  postalCode: z.string().min(5, "Postal code must be at least 5 characters long"),
});

export type ExtendedAddress = z.infer<typeof ExtendedAddressSchema>;