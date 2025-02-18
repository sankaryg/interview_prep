import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFlashcardSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/flashcards", async (req, res) => {
    const category = req.query.category as string | undefined;
    const flashcards = category
      ? await storage.getFlashcardsByCategory(category)
      : await storage.getFlashcards();
    res.json(flashcards);
  });

  app.post("/api/flashcards", async (req, res) => {
    const parsed = insertFlashcardSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const flashcard = await storage.createFlashcard(parsed.data);
    res.json(flashcard);
  });

  app.patch("/api/flashcards/:id/difficulty", async (req, res) => {
    const id = parseInt(req.params.id);
    const { difficulty } = req.body;
    
    if (typeof difficulty !== "number" || difficulty < -1 || difficulty > 1) {
      return res.status(400).json({ error: "Invalid difficulty value" });
    }

    try {
      const flashcard = await storage.updateFlashcardDifficulty(id, difficulty);
      res.json(flashcard);
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  app.post("/api/flashcards/:id/review", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const flashcard = await storage.updateFlashcardReview(id);
      res.json(flashcard);
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  return createServer(app);
}
