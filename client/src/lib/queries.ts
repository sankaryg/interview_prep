
import { groq } from 'next-sanity';
import { client } from './sanity';

// GROQ queries
export const flashcardsQuery = groq`
  *[_type == "flashcard"] {
    _id,
    question,
    answer,
    category,
    difficulty,
    timesReviewed,
    lastReviewed
  }
`;

export const flashcardsByCategoryQuery = groq`
  *[_type == "flashcard" && category == $category] {
    _id,
    question,
    answer,
    category,
    difficulty,
    timesReviewed,
    lastReviewed
  }
`;

// Query functions
export async function getFlashcards() {
  return client.fetch(flashcardsQuery);
}

export async function getFlashcardsByCategory(category: string) {
  return client.fetch(flashcardsByCategoryQuery, { category });
}

export async function getFlashcard(id: string) {
  return client.fetch(
    groq`*[_type == "flashcard" && _id == $id][0]`,
    { id }
  );
}
