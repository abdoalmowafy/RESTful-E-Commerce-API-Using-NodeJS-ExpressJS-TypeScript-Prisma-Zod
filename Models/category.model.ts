import { z } from 'zod';
import { CategorySchema } from './generated/zod';

export const ExtendedCategorySchema = CategorySchema.extend({
  id: z.undefined(),
  name: z.string().min(3, "Category name must be at least 3 characters long"),
});

export type ExtendedCategory = z.infer<typeof ExtendedCategorySchema>;