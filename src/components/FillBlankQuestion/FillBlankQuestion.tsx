import React, { useEffect, useState } from "react";
import { playAnswerSoundFX } from "../../utils/soundFX";

interface FillInTheBlankQuestion {
  type: "fillInTheBlank";
  question: string;
  text: string;
  solution: string; // Now a string instead of an array
  options: string[];
}

interface Props {
  question: FillInTheBlankQuestion;
  setQuestionSolved: (on: boolean) => void;
}

const FillInTheBlank: React.FC<Props> = ({ question, setQuestionSolved }) => {
  const { text, solution, options } = question;
  const parts = text.split("_"); // Expecting exactly two parts
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [checkResult, setCheckResult] = useState<boolean | null>(null);

  // If the answer is correct, inform the parent
  useEffect(() => {
    if (checkResult) {
      setQuestionSolved(true);
    }
  }, [checkResult, setQuestionSolved]);

  // Called when an option button is clicked
  const handleOptionClick = (option: string) => {
    // Toggle off if user clicks the same option
    if (userAnswer === option) {
      setUserAnswer("");
      setCheckResult(null);
    } else {
      setUserAnswer(option);
      checkAnswers(option);
    }
  };

  // Compare the selected answer with the solution (case-insensitive)
  const checkAnswers = (selectedAnswer: string): boolean => {
    const isCorrect = selectedAnswer.toLowerCase() === solution.toLowerCase();
    setCheckResult(isCorrect);
    playAnswerSoundFX(isCorrect);
    return isCorrect;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-start">{question.question}</h2>
      <p className="text-lg text-start">
        {parts[0]}
        <input
          type="text"
          value={userAnswer}
          readOnly
          className="w-20 px-2 py-1 mx-2 text-center bg-gray-100 border rounded cursor-not-allowed"
        />
        {parts[1]}
      </p>

      <div className="flex flex-col items-center gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`px-4 py-2 border rounded hover:brightness-90 w-32 text-center ${
              userAnswer === option ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {checkResult !== null && (
        <div className="mt-4 text-lg">
          {checkResult ? (
            <span className="text-green-700">Correct!</span>
          ) : (
            <span className="text-red-700">Incorrect.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
