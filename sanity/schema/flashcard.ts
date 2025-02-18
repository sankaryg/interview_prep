import { defineField, defineType } from 'sanity';
import { categories } from '../../shared/schema';

export default defineType({
  name: 'flashcard',
  title: 'Flashcard',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: categories.map(category => ({
          title: category,
          value: category,
        })),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.min(-1).max(1),
    }),
    defineField({
      name: 'timesReviewed',
      title: 'Times Reviewed',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last Reviewed',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
});