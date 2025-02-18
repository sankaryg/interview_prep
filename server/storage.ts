import { flashcards, type Flashcard, type InsertFlashcard } from "@shared/schema";

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  getFlashcardsByCategory(category: string): Promise<Flashcard[]>;
  updateFlashcardDifficulty(id: number, difficulty: number): Promise<Flashcard>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(id: number): Promise<Flashcard>;
}

export class MemStorage implements IStorage {
  private flashcards: Map<number, Flashcard>;
  private currentId: number;

  constructor() {
    this.flashcards = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleData: InsertFlashcard[] = [
      {
        question: "What is hoisting in JavaScript?",
        answer: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope before code execution.",
        category: "JavaScript",
        difficulty: 0,
      },
      {
        question: "Explain the Virtual DOM in React",
        answer: "Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by minimizing direct manipulation of the DOM.",
        category: "React",
        difficulty: 0,
      },
    ];

    sampleData.forEach(card => this.createFlashcard(card));
  }

  async getFlashcards(): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values());
  }

  async getFlashcardsByCategory(category: string): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values()).filter(
      card => card.category === category
    );
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.currentId++;
    const newCard: Flashcard = {
      ...flashcard,
      id,
      timesReviewed: 0,
      lastReviewed: null,
    };
    this.flashcards.set(id, newCard);
    return newCard;
  }

  async updateFlashcardDifficulty(
    id: number,
    difficulty: number
  ): Promise<Flashcard> {
    const card = this.flashcards.get(id);
    if (!card) throw new Error("Flashcard not found");

    const updatedCard = { ...card, difficulty };
    this.flashcards.set(id, updatedCard);
    return updatedCard;
  }

  async updateFlashcardReview(id: number): Promise<Flashcard> {
    const card = this.flashcards.get(id);
    if (!card) throw new Error("Flashcard not found");

    const updatedCard = {
      ...card,
      timesReviewed: card.timesReviewed + 1,
      lastReviewed: new Date().toISOString(),
    };
    this.flashcards.set(id, updatedCard);
    return updatedCard;
  }
}

export const storage = new MemStorage();
