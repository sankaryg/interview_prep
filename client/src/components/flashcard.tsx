import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type Flashcard } from "@shared/schema";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface FlashcardProps {
  card: Flashcard;
}

export function FlashcardComponent({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const updateDifficulty = useMutation({
    mutationFn: async (difficulty: number) => {
      await apiRequest(
        "PATCH",
        `/api/flashcards/${card.id}/difficulty`,
        { difficulty }
      );
      await apiRequest("POST", `/api/flashcards/${card.id}/review`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
    },
  });

  return (
    <div className="relative w-full max-w-xl mx-auto h-[300px] [perspective:1000px]">
      <div
        className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500 cursor-pointer"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full p-6 [backface-visibility:hidden]">
          <div className="flex flex-col h-full justify-between">
            <div className="text-lg font-medium">{card.question}</div>
            <div className="text-sm text-muted-foreground">
              Click to reveal answer
            </div>
          </div>
        </Card>

        {/* Back of card */}
        <Card 
          className="absolute w-full h-full p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary text-primary-foreground"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="text-lg whitespace-pre-wrap">{card.answer}</div>
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDifficulty.mutate(-1);
                }}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Difficult
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDifficulty.mutate(1);
                }}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Easy
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}