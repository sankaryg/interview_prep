import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlashcardComponent } from "@/components/flashcard";
import { CategoryFilter } from "@/components/category-filter";
import { SearchBar } from "@/components/search-bar";
import { type Flashcard } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDueOnly, setShowDueOnly] = useState(true);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      return response.json();
    },
  });

  const { data: flashcards, isLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards", selectedCategory, showDueOnly, user?.interests],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (showDueOnly) params.append("due", "true");

      const url = `/api/flashcards?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch flashcards");
      return response.json();
    },
  });

  const { logoutMutation } = useAuth(); // Added logoutMutation

  const filteredCards = flashcards?.filter((card) =>
    card.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCard = filteredCards?.[currentIndex];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Interview Prep Flashcards
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-2">
            <Switch
              id="due-cards"
              checked={showDueOnly}
              onCheckedChange={setShowDueOnly}
            />
            <Label htmlFor="due-cards">Show due cards only</Label>
          </div>
        </div>

        <div className="flex items-center justify-between space-y-2"> {/* Added div for logout button */}
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>

        {isLoading ? (
          <Card className="w-full max-w-xl mx-auto h-[300px] animate-pulse" />
        ) : filteredCards?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No flashcards found
          </div>
        ) : currentCard ? (
          <>
            <FlashcardComponent card={currentCard} />
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredCards.length - 1
                )}
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {filteredCards.length}
              </span>
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentIndex((prev) =>
                  prev < filteredCards.length - 1 ? prev + 1 : 0
                )}
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}