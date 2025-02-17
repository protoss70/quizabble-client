export const questions = {
  questions: [
    {
      type: 'wordMatch',
      originalWords: ['travel', 'hobbies', 'food', 'music', 'future'],
      translatedWords: ['gelecek', 'seyahat', 'hobiler', 'yemek', 'müzik'],
      answer: [
        ['travel', 'seyahat'],
        ['hobbies', 'hobiler'],
        ['food', 'yemek'],
        ['music', 'müzik'],
        ['future', 'gelecek'],
      ],
    },
    {
      type: 'rearrangement-listening',
      question:
        'https://quizabble-bucket-frankfurt.s3.eu-central-1.amazonaws.com/tts/michael/tts-19e04389-d957-40bd-a5aa-5622cc7c1502',
      solution: 'I am a student',
      options: ['student', "I", 'he', "am a", 'play', 'like', 'run'],
    },
    {
      type: 'rearrangement',
      question: "What's your name?",
      solution: 'My name is John',
      options: ['is', 'my', 'go', 'John', 'play', 'name'],
    },
    {
      type: 'fillInTheBlank',
      question: 'Where do you live normally?',
      text: 'I normally _ in New York.',
      solution: ['live'],
      options: ['live', 'travel', 'visit'],
    },
    {
      type: 'fillInTheBlank',
      question: 'Do you have a favorite restaurant in your city?',
      text: 'Yes, my favorite restaurant is _ the city center.',
      solution: ['in'],
      options: ['on', 'at', 'in'],
    },
    {
      type: 'fillInTheBlank',
      question: 'Are you a morning person or a night owl?',
      text: 'I am a morning _.',
      solution: ['person'],
      options: ['person', 'cup', 'bed'],
    },
    {
      type: 'speaking',
      question: 'travel',
    },
  ],
};
