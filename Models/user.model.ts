import { z } from 'zod';
import { UserSchema } from './generated/zod';

export const ExtendedUserSchema = UserSchema.extend({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
});

export type ExtendedUser = z.infer<typeof ExtendedUserSchema>;