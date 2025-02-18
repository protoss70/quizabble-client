import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import WordMatchQuestion from '../components/WordMatchQuestion/WordMatchQuestion';
import RearrangementQuestion from '../components/RearrangeQuestion/RearrangeQuestion';
import FillInTheBlank from '../components/FillBlankQuestion/FillBlankQuestion';
import SpeakingQuestion from '../components/SpeakingQuestion/SpeakingQuestion';
import { playTestCompletedSoundFX } from '../utils/soundFX';

// Create a custom LinearProgress with a green bar and smooth animation.
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#4caf50', // Green color for the progress bar.
  },
}));

const Test1: React.FC = () => {
  const [questionSolved, setQuestionSolved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showFinishScreen, setShowFinishScreen] = useState(false);

  const questionData = {
    questions: [
      {
        type: 'wordMatch',
        originalWords: ['travel'],
        translatedWords: ['seyahat'],
        answer: [['travel', 'seyahat']],
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
        solution: 'live',
        options: ['live', 'travel', 'visit'],
      },
      {
        type: 'rearrangement-listening',
        question:
          'https://quizabble-bucket-frankfurt.s3.eu-central-1.amazonaws.com/tts/michael/tts-19e04389-d957-40bd-a5aa-5622cc7c1502',
        solution: 'I am a student',
        options: ['student', 'I', 'he', 'am a', 'play', 'like', 'run'],
      },
      {
        type: 'speaking',
        question: 'travel',
      },
    ],
  };

  function nextQuestionClick() {
    if (currentIndex < questionData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setQuestionSolved(false);
    } else {
      setShowFinishScreen(true);
      playTestCompletedSoundFX();
    }
  }

  const renderQuestion = (question: any) => { // eslint-disable-line
    switch (question.type) {
      case 'wordMatch':
        return <WordMatchQuestion question={question} setQuestionSolved={setQuestionSolved} />;
      case 'rearrangement-listening':
      case 'rearrangement':
        return <RearrangementQuestion question={question} setQuestionSolved={setQuestionSolved} />;
      case 'fillInTheBlank':
        return <FillInTheBlank question={question} setQuestionSolved={setQuestionSolved} />;
      case 'speaking':
        return <SpeakingQuestion questionObj={question} setQuestionSolved={setQuestionSolved} />;
      default:
        return null;
    }
  };

  // Calculate progress: if finished, show 100%; otherwise, progress is based on the current index.
  const totalQuestions = questionData.questions.length;
  const progress = showFinishScreen 
    ? 100 
    : ((currentIndex + (questionSolved ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div>
      {/* Fixed progress bar at the top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <BorderLinearProgress variant="determinate" value={progress} />
      </div>
      {/* Add top margin to avoid content being hidden behind the fixed progress bar */}
      <div style={{ marginTop: '20px' }}>
        {showFinishScreen ? (
          <div className="p-4 text-xl font-bold text-center text-green-500">
            Congratulations! You have completed all the questions.
          </div>
        ) : (
          <div className="question-container">
            <div className="p-4 border-2 border-gray-400 rounded-xl">
              {renderQuestion(questionData.questions[currentIndex])}
            </div>
            {questionSolved && (
              <button
                onClick={nextQuestionClick}
                className="px-4 py-2 mt-4 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
              >
                Next Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test1;
