import { z } from 'zod';
import { ReviewSchema } from './generated/zod';

export const ExtendedReviewSchema = ReviewSchema.extend({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Comment should be at least 10 characters long"),
});

export type ExtendedReview = z.infer<typeof ExtendedReviewSchema>;