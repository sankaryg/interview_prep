import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFlashcardSchema, QUALITY_RATINGS } from "@shared/schema";
import express from 'express';
import { setupAuth } from "./auth";

function ensureAuthenticated(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express) {
  // Set up authentication
  setupAuth(app);

  // Serve Sanity Studio at /studio route
  app.use('/studio', express.static('sanity/dist'));

  // Protected routes
  app.get("/api/flashcards", ensureAuthenticated, async (req, res) => {
    const category = req.query.category as string | undefined;
    const dueOnly = req.query.due === 'true';
    const userId = req.user!.id;

    let flashcards;
    if (dueOnly) {
      flashcards = await storage.getDueFlashcards(userId);
    } else {
      flashcards = category
        ? await storage.getFlashcardsByCategory(userId, category)
        : await storage.getFlashcards(userId);
    }
    res.json(flashcards);
  });

  app.post("/api/flashcards", ensureAuthenticated, async (req, res) => {
    const parsed = insertFlashcardSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const flashcard = await storage.createFlashcard(req.user!.id, parsed.data);
    res.json(flashcard);
  });

  app.patch("/api/flashcards/:id/difficulty", ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    const { difficulty } = req.body;

    if (typeof difficulty !== "number" || difficulty < -1 || difficulty > 1) {
      return res.status(400).json({ error: "Invalid difficulty value" });
    }

    try {
      const flashcard = await storage.updateFlashcardDifficulty(req.user!.id, id, difficulty);
      res.json(flashcard);
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  app.post("/api/flashcards/:id/review", ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    const { quality } = req.body;

    if (!Object.values(QUALITY_RATINGS).includes(quality)) {
      return res.status(400).json({ error: "Invalid quality rating" });
    }

    try {
      const flashcard = await storage.updateFlashcardReview(req.user!.id, id, quality);
      res.json(flashcard);
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  return createServer(app);
}