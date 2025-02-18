import { flashcards, type Flashcard, type InsertFlashcard } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  getFlashcardsByCategory(category: string): Promise<Flashcard[]>;
  updateFlashcardDifficulty(id: string, difficulty: number): Promise<Flashcard>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(id: string): Promise<Flashcard>;
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
    },
    {
      id: "2",
      question: "Explain closures in JavaScript",
      answer: "A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any local variables that were in-scope at the time the closure was created.",
      category: "JavaScript",
      difficulty: 0,
      timesReviewed: 0,
      lastReviewed: null,
    },
  ];

  async getFlashcards(): Promise<Flashcard[]> {
    return this.flashcards;
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

  async updateFlashcardReview(id: string): Promise<Flashcard> {
    const flashcard = this.flashcards.find((f) => f.id === id);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }
    flashcard.timesReviewed += 1;
    flashcard.lastReviewed = new Date().toISOString();
    return flashcard;
  }
}

export const storage = new MemStorage();