import { z } from 'zod';
import { ProductSchema } from './generated/zod/index';

export const ExtendedProductSchema = ProductSchema.extend({
  name: z.string().min(1, "Product name cannot be empty"),
  priceCents: z.number().int().positive("Price must be a positive integer"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  salePercent: z.number().min(0, "Sale percent cannot be less than 0").max(100, "Sale percent cannot be more than 100"),
});

export type ExtendedProduct = z.infer<typeof ExtendedProductSchema>;