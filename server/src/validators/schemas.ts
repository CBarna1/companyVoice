import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export const postSchema = z.object({
  type: z.enum(['challenge', 'solution', 'both']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  department: z.string().min(1, 'Department is required'),
  tags: z.array(z.string()).optional(),
  is_anonymous: z.boolean().default(false),
  solution_links: z.array(z.number()).optional(),
});

export const commentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(5000),
  is_anonymous: z.boolean().default(false),
});

export const voteSchema = z.object({
  direction: z.enum(['up', 'down']),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved']),
});

export const settingsSchema = z.object({
  anonymity_enabled: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
