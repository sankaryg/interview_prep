import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  difficulty: integer("difficulty").default(0),
  timesReviewed: integer("times_reviewed").default(0),
  lastReviewed: text("last_reviewed"),
  easinessFactor: decimal("easiness_factor").default("2.5"),
  interval: integer("interval").default(0),
  nextReviewDate: text("next_review_date"),
});

export const categories = [
  "JavaScript",
  "React",
  "Data Structures",
  "Algorithms",
  "System Design",
  "Behavioral",
] as const;

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export const insertFlashcardSchema = createInsertSchema(flashcards)
  .omit({ 
    id: true, 
    userId: true,
    timesReviewed: true, 
    lastReviewed: true,
    easinessFactor: true,
    interval: true,
    nextReviewDate: true 
  })
  .extend({
    category: z.enum(categories),
    difficulty: z.number().min(-1).max(1).default(0),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

// Spaced repetition quality ratings
export const QUALITY_RATINGS = {
  WRONG: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
} as const;