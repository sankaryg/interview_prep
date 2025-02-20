
# Interview Flashcards

A spaced repetition flashcard application designed to help you prepare for technical interviews.

## Features

- Create and manage flashcards for different technical topics
- Spaced repetition system for optimal learning
- Category-based organization
- Progress tracking
- Search functionality
- Due cards filtering

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn/ui
- Backend: Express.js, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Authentication: Passport.js
- Content Management: Sanity.io

## Getting Started

1. Clone the project
2. Install dependencies:
```bash
npm install
```
3. Set up your database credentials in environment variables
4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## Project Structure

- `/client` - React frontend application
- `/server` - Express.js backend
- `/shared` - Shared types and utilities
- `/sanity` - Sanity CMS configuration

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session secret for authentication
- `SANITY_PROJECT_ID` - Sanity project ID
- `SANITY_DATASET` - Sanity dataset name

## License

MIT
# Flashcard Interview Prep Application

## Overview
A full-stack application for interview preparation using spaced repetition flashcards. Built with React, Express, and TypeScript.

## Project Structure
```
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/            # Backend Express server
│   ├── auth.ts        # Authentication logic
│   ├── routes.ts      # API routes
│   └── storage.ts     # Database operations
└── shared/            # Shared types and utilities
```

## Features
- User authentication (Google, GitHub, Local)
- Spaced repetition algorithm for optimized learning
- Category-based flashcard organization
- Progress tracking
- Search functionality
- Due cards filtering

## Technical Components

### Frontend Components
- `FlashcardComponent`: Displays individual flashcards with flip animation
- `CategoryFilter`: Filters flashcards by category
- `SearchBar`: Enables flashcard search
- `InterestSelector`: User interest selection during onboarding

### Authentication
- Multiple authentication strategies (Google, GitHub, Local)
- Protected routes using session-based authentication
- Secure password handling

### Spaced Repetition System
- SuperMemo 2 algorithm implementation
- Quality ratings: Easy, Hard, Wrong
- Automatic scheduling based on user performance

## API Endpoints

### Authentication
- `POST /auth/login`: Local login
- `GET /auth/google`: Google OAuth login
- `GET /auth/github`: GitHub OAuth login
- `POST /auth/logout`: Logout

### Flashcards
- `GET /api/flashcards`: Get all flashcards
- `GET /api/flashcards?category={category}`: Get flashcards by category
- `POST /api/flashcards/{id}/review`: Submit flashcard review

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at http://0.0.0.0:5000

## Environment Variables
Required environment variables:
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `SESSION_SECRET`: Session encryption secret
