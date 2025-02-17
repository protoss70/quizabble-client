import React, { useState } from 'react';
import WordMatchQuestion from '../components/WordMatchQuestion/WordMatchQuestion';
import RearrangementQuestion from '../components/RearrangeQuestion/RearrangeQuestion';
import FillInTheBlank from '../components/FillBlankQuestion/FillBlankQuestion';
import SpeakingQuestion from '../components/SpeakingQuestion/SpeakingQuestion';

const Test1: React.FC = () => {
  const questionData = {
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

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    if (currentIndex < questionData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  // @
  const renderQuestion = (question: any) => { // eslint-disable-line
    switch (question.type) {
      case 'wordMatch':
        return (
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <WordMatchQuestion question={question} />
          </div>
        );
      case 'rearrangement-listening':
        return (
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <RearrangementQuestion question={question} />
          </div>
        );
      case 'rearrangement':
        return (
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <RearrangementQuestion question={question} />
          </div>
        );
      case 'fillInTheBlank':
        return (
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <FillInTheBlank question={question} />
          </div>
        );
      case 'speaking':
        return (
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <SpeakingQuestion questionObj={question} />
          </div>
        );
      default:
        return null;
    }
  };

  const currentQuestion = questionData.questions[currentIndex];

  return (
    <div>
      <h1>Test1 Component</h1>
      <p>This is a template component named Test1.</p>
      <div className="question-container">
        {renderQuestion(currentQuestion)}
      </div>

      <div className="mt-4 navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 font-semibold text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === questionData.questions.length - 1}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Test1;
