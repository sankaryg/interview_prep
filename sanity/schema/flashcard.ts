import { defineType } from 'sanity';

export default defineType({
  name: 'flashcard',
  title: 'Flashcard',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'timesReviewed',
      title: 'Times Reviewed',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'lastReviewed',
      title: 'Last Reviewed',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
});