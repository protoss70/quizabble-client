import React, { useState } from "react";
import OptionSelect from "../OptionSelect/OptionSelect";

interface MultipleChoiceQuestionProps {
  text: string;
  options: string[];
  answer: number;
  questionText?: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  text,
  options,
  answer,
  questionText = "Please select the correct option below according to the question",
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<boolean[]>(new Array(options.length).fill(false));
  const [checkResult, setCheckResult] = useState<boolean | null>(null);

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setHighlighted(new Array(options.length).fill(false)); // Reset highlights on new selection
  };

  const checkAnswer = (): boolean | null => {
    if (selectedOption === null) {
      setHighlighted(new Array(options.length).fill(true)); // Highlight all options if no answer is selected
      setCheckResult(null);
      return null;
    }
    setHighlighted(new Array(options.length).fill(false));
    const isCorrect = selectedOption === answer;
    setCheckResult(isCorrect);
    return isCorrect;
  };

  return (
    <div className="p-4 space-y-6">
      <p className="text-lg text-start">{text}</p>
      <h2 className="text-lg font-semibold text-start">{questionText}</h2>

      <OptionSelect
        options={options}
        selectedOption={selectedOption}
        highlighted={highlighted}
        onSelect={handleSelect}
      />

      <button
        onClick={() => {
          const result = checkAnswer();
          console.log(result); // Log the result of the check
        }}
        className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
      >
        Check Answer
      </button>

      {checkResult !== null && (
        <span className="block mt-4 text-lg">
          {checkResult ? "True" : "False"}
        </span>
      )}
      {checkResult === null && (
        <span className="block mt-4 text-lg">Null</span>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
