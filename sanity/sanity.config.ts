import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schema';
import { visionTool } from '@sanity/vision';

export default defineConfig({
  name: 'flashcards',
  title: 'Interview Flashcards',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  basePath: '/studio',
});