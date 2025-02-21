
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schema'

export default defineConfig({
  name: 'default',
  title: 'Flashcard App',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
