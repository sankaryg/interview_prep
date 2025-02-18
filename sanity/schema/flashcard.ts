export default {
  name: 'flashcard',
  title: 'Flashcard',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'JavaScript',
          'React',
          'Data Structures',
          'Algorithms',
          'System Design',
          'Behavioral',
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.min(-1).max(1),
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
};
