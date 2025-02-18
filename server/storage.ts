import { flashcards, type Flashcard, type InsertFlashcard } from "@shared/schema";
import { calculateNextReview } from "@shared/spaced-repetition";
import { nanoid } from "nanoid";

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  getFlashcardsByCategory(category: string): Promise<Flashcard[]>;
  getDueFlashcards(): Promise<Flashcard[]>;
  updateFlashcardDifficulty(id: string, difficulty: number): Promise<Flashcard>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(id: string, quality: number): Promise<Flashcard>;
}

export class MemStorage implements IStorage {
  private flashcards: Flashcard[] = [
    {
      id: "1",
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and allows you to create reusable UI components.",
      category: "React",
      difficulty: 0,
      timesReviewed: 0,
      lastReviewed: null,
      easinessFactor: 2.5,
      interval: 0,
      nextReviewDate: null,
    },
    {
      id: "2",
      question: "Explain closures in JavaScript",
      answer: "A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any local variables that were in-scope at the time the closure was created.",
      category: "JavaScript",
      difficulty: 0,
      timesReviewed: 0,
      lastReviewed: null,
      easinessFactor: 2.5,
      interval: 0,
      nextReviewDate: null,
    },
  ];

  async getFlashcards(): Promise<Flashcard[]> {
    return this.flashcards;
  }

  async getDueFlashcards(): Promise<Flashcard[]> {
    const now = new Date();
    return this.flashcards.filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    });
  }

  async getFlashcardsByCategory(category: string): Promise<Flashcard[]> {
    return this.flashcards.filter((card) => card.category === category);
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: nanoid(),
      timesReviewed: 0,
      lastReviewed: null,
      easinessFactor: 2.5,
      interval: 0,
      nextReviewDate: null,
    };
    this.flashcards.push(newFlashcard);
    return newFlashcard;
  }

  async updateFlashcardDifficulty(id: string, difficulty: number): Promise<Flashcard> {
    const flashcard = this.flashcards.find((f) => f.id === id);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }
    flashcard.difficulty = difficulty;
    return flashcard;
  }

  async updateFlashcardReview(id: string, quality: number): Promise<Flashcard> {
    const flashcard = this.flashcards.find((f) => f.id === id);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }

    const { easinessFactor, interval, nextReviewDate } = calculateNextReview(quality, {
      easinessFactor: flashcard.easinessFactor,
      interval: flashcard.interval,
      nextReviewDate: flashcard.nextReviewDate,
    });

    flashcard.easinessFactor = easinessFactor;
    flashcard.interval = interval;
    flashcard.nextReviewDate = nextReviewDate;
    flashcard.timesReviewed += 1;
    flashcard.lastReviewed = new Date().toISOString();

    return flashcard;
  }
}

export const storage = new MemStorage();