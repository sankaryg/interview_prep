
# Components Documentation

## UI Components

### FlashcardComponent
The main component for displaying flashcards with flip animation and review options.

Props:
- `card`: Flashcard object containing question and answer
- `onReview`: Callback function for handling review submissions

### CategoryFilter
Allows users to filter flashcards by category.

Props:
- `selectedCategory`: Currently selected category
- `onSelectCategory`: Callback for category selection

### SearchBar
Enables users to search through flashcards.

Props:
- `value`: Search query string
- `onChange`: Callback for search input changes

### InterestSelector
Used during onboarding to select user interests.

Props:
- `selectedInterests`: Array of selected interests
- `onInterestsChange`: Callback for interest selection changes

## Hooks

### useAuth
Custom hook for authentication state management.
Returns:
- `user`: Current user object
- `login`: Login mutation
- `logout`: Logout mutation
- `register`: Registration mutation

### useMobile
Responsive design hook for mobile detection.
Returns:
- `isMobile`: Boolean indicating mobile viewport

### useToast
Toast notification management hook.
Methods:
- `toast`: Show toast notification
- `dismiss`: Dismiss toast notification
