import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flashcards = pgTable("flashcards", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  difficulty: integer("difficulty").default(0),
  timesReviewed: integer("times_reviewed").default(0),
  lastReviewed: text("last_reviewed"),
});

export const categories = [
  "JavaScript",
  "React",
  "Data Structures",
  "Algorithms",
  "System Design",
  "Behavioral",
] as const;

export const insertFlashcardSchema = createInsertSchema(flashcards)
  .omit({ id: true, timesReviewed: true, lastReviewed: true })
  .extend({
    category: z.enum(categories),
    difficulty: z.number().min(-1).max(1).default(0),
  });

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;