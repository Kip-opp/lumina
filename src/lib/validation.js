import { z } from 'zod';

// Email validation schema
export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

// Password validation schema (basic)
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Writing content schema
export const writingTextSchema = z.string().max(50000, 'Text too long').optional();

// Writing context schema
export const writingContextSchema = z.object({
  writingType: z.string().max(100).optional(),
  contextText: z.string().max(10000).optional(),
  fileName: z.string().max(255).optional(),
  fileContent: z.string().max(100000).optional(),
  outputInstructions: z.string().max(1000).optional(),
}).optional();

// AI service input schemas
export const analyzeTextSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(50000),
  writingContext: writingContextSchema,
});

export const generateSchema = z.object({
  text: writingTextSchema,
  writingContext: writingContextSchema,
});