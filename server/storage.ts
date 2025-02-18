import { flashcards, type Flashcard, type InsertFlashcard, type User, type InsertUser, users } from "@shared/schema";
import { calculateNextReview } from "@shared/spaced-repetition";
import { nanoid } from "nanoid";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;

  // Flashcard operations
  getFlashcards(userId: string): Promise<Flashcard[]>;
  getFlashcardsByCategory(userId: string, category: string): Promise<Flashcard[]>;
  getDueFlashcards(userId: string): Promise<Flashcard[]>;
  updateFlashcardDifficulty(userId: string, id: string, difficulty: number): Promise<Flashcard>;
  createFlashcard(userId: string, flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(userId: string, id: string, quality: number): Promise<Flashcard>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private flashcards: Flashcard[] = [];
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find((u) => u.username === username) ?? null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  async getFlashcards(userId: string): Promise<Flashcard[]> {
    return this.flashcards.filter((card) => card.userId === userId);
  }

  async getDueFlashcards(userId: string): Promise<Flashcard[]> {
    const now = new Date();
    return this.flashcards.filter(card => {
      if (card.userId !== userId) return false;
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    });
  }

  async getFlashcardsByCategory(userId: string, category: string): Promise<Flashcard[]> {
    return this.flashcards.filter((card) => card.userId === userId && card.category === category);
  }

  async createFlashcard(userId: string, flashcard: InsertFlashcard): Promise<Flashcard> {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: nanoid(),
      userId,
      timesReviewed: 0,
      lastReviewed: null,
      easinessFactor: "2.5",
      interval: 0,
      nextReviewDate: null,
    };
    this.flashcards.push(newFlashcard);
    return newFlashcard;
  }

  async updateFlashcardDifficulty(userId: string, id: string, difficulty: number): Promise<Flashcard> {
    const flashcard = this.flashcards.find((f) => f.id === id && f.userId === userId);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }
    flashcard.difficulty = difficulty;
    return flashcard;
  }

  async updateFlashcardReview(userId: string, id: string, quality: number): Promise<Flashcard> {
    const flashcard = this.flashcards.find((f) => f.id === id && f.userId === userId);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }

    const { easinessFactor, interval, nextReviewDate } = calculateNextReview(quality, {
      easinessFactor: Number(flashcard.easinessFactor),
      interval: flashcard.interval,
      nextReviewDate: flashcard.nextReviewDate,
    });

    flashcard.easinessFactor = easinessFactor.toString();
    flashcard.interval = interval;
    flashcard.nextReviewDate = nextReviewDate;
    flashcard.timesReviewed += 1;
    flashcard.lastReviewed = new Date().toISOString();

    return flashcard;
  }
}

export const storage = new MemStorage();