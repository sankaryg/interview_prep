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
          {title: 'JavaScript', value: 'JavaScript'},
          {title: 'React', value: 'React'},
          {title: 'Data Structures', value: 'Data Structures'},
          {title: 'Algorithms', value: 'Algorithms'},
          {title: 'System Design', value: 'System Design'},
          {title: 'Behavioral', value: 'Behavioral'},
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
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
};