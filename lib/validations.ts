import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(50),
  tags: z.array(z.string().min(1).max(35)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const UserSchema = z.object({
  name: z.string().min(3).max(35),
  username: z.string().min(3).max(20),
  portfolioWebsite: z.string().min(8).url().optional().or(z.literal("")),
  location: z.string().min(3).optional().or(z.literal("")),
  bio: z.string().max(200).optional().or(z.literal("")),
});