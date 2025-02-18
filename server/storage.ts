import { flashcards, type Flashcard, type InsertFlashcard } from "@shared/schema";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2024-02-18",
  token: process.env.SANITY_TOKEN!,
  useCdn: false,
});

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  getFlashcardsByCategory(category: string): Promise<Flashcard[]>;
  updateFlashcardDifficulty(id: string, difficulty: number): Promise<Flashcard>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(id: string): Promise<Flashcard>;
}

export class SanityStorage implements IStorage {
  async getFlashcards(): Promise<Flashcard[]> {
    const query = `*[_type == "flashcard"] {
      "id": _id,
      question,
      answer,
      category,
      difficulty,
      "timesReviewed": coalesce(timesReviewed, 0),
      "lastReviewed": lastReviewed
    }`;

    const flashcards = await client.fetch(query);
    return flashcards;
  }

  async getFlashcardsByCategory(category: string): Promise<Flashcard[]> {
    const query = `*[_type == "flashcard" && category == $category] {
      "id": _id,
      question,
      answer,
      category,
      difficulty,
      "timesReviewed": coalesce(timesReviewed, 0),
      "lastReviewed": lastReviewed
    }`;

    const flashcards = await client.fetch(query, { category });
    return flashcards;
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const doc = {
      _type: 'flashcard',
      ...flashcard,
      timesReviewed: 0,
      lastReviewed: null,
    };

    const result = await client.create(doc);
    return {
      ...flashcard,
      id: result._id,
      timesReviewed: 0,
      lastReviewed: null,
    };
  }

  async updateFlashcardDifficulty(id: string, difficulty: number): Promise<Flashcard> {
    const result = await client
      .patch(id)
      .set({ difficulty })
      .commit();

    return {
      id: result._id,
      question: result.question,
      answer: result.answer,
      category: result.category,
      difficulty: result.difficulty,
      timesReviewed: result.timesReviewed || 0,
      lastReviewed: result.lastReviewed,
    };
  }

  async updateFlashcardReview(id: string): Promise<Flashcard> {
    const now = new Date().toISOString();

    // First get the current timesReviewed value
    const currentDoc = await client.getDocument(id);
    if (!currentDoc) {
      throw new Error("Flashcard not found");
    }
    const currentTimesReviewed = currentDoc.timesReviewed || 0;

    const result = await client
      .patch(id)
      .set({
        lastReviewed: now,
        timesReviewed: currentTimesReviewed + 1
      })
      .commit();

    return {
      id: result._id,
      question: result.question,
      answer: result.answer,
      category: result.category,
      difficulty: result.difficulty,
      timesReviewed: result.timesReviewed || 0,
      lastReviewed: result.lastReviewed,
    };
  }
}

export const storage = new SanityStorage();