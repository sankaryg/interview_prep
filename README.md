
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
