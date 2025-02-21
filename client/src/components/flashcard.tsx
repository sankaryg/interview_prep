import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { type Flashcard, QUALITY_RATINGS } from "@shared/schema";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFlashcards, getFlashcardsByCategory } from "@/lib/queries";

const useFlashcards = (category?: string) => {
  return useQuery({
    queryKey: ['flashcards', category],
    queryFn: () => category ? getFlashcardsByCategory(category) : getFlashcards()
  });
};

interface FlashcardProps {
  card: Flashcard;
}

export function FlashcardComponent({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const updateReview = useMutation({
    mutationFn: async (quality: number) => {
      await apiRequest(
        "POST",
        `/api/flashcards/${card.id}/review`,
        { quality }
      );
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
                  updateReview.mutate(QUALITY_RATINGS.WRONG);
                }}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Wrong
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  updateReview.mutate(QUALITY_RATINGS.HARD);
                }}
              >
                <Meh className="h-4 w-4 mr-2" />
                Hard
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  updateReview.mutate(QUALITY_RATINGS.EASY);
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