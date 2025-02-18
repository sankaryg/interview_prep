type SpacedRepetitionData = {
  easinessFactor: number;
  interval: number;
  nextReviewDate: string | null;
};

export function calculateNextReview(
  quality: number,
  currentData: SpacedRepetitionData
): SpacedRepetitionData {
  // Implement SuperMemo 2 Algorithm
  let { easinessFactor, interval } = currentData;
  
  // Calculate new easiness factor
  const newEF = Math.max(
    1.3,
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate new interval
  let newInterval: number;
  if (interval === 0) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * easinessFactor);
  }

  // Calculate next review date
  const now = new Date();
  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easinessFactor: Number(newEF.toFixed(2)),
    interval: newInterval,
    nextReviewDate: nextReview.toISOString(),
  };
}

export function getDueCards(cards: Array<{ nextReviewDate: string | null }>) {
  const now = new Date();
  return cards.filter(card => {
    if (!card.nextReviewDate) return true;
    return new Date(card.nextReviewDate) <= now;
  });
}
