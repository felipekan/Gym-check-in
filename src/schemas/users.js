import { boolean, z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  subscription: z.number().min(1).max(12).optional(),
  coupon: boolean().default(false),
});

export function validateUser(object) {
  return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
  return userSchema.partial().safeParse(object);
}
