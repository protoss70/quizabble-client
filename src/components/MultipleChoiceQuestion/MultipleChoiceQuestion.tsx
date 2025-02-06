import React, { useState } from "react";

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

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setHighlighted(new Array(options.length).fill(false)); // Reset highlights on new selection
  };

  const checkAnswer = (): boolean | null => {
    if (selectedOption === null) {
      setHighlighted(new Array(options.length).fill(true)); // Highlight all options if no answer is selected
      return null;
    }
    setHighlighted(new Array(options.length).fill(false));
    return selectedOption === answer;
  };

  return (
    <div className="p-4 space-y-6">
      <p className="text-lg">{text}</p>
      <h2 className="text-lg font-semibold">{questionText}</h2>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`px-4 py-2 border rounded ${
              highlighted[index] ? "border-red-500 bg-red-100" : ""
            } ${selectedOption === index ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          const result = checkAnswer();
          console.log(result); // Log the result of the check
        }}
        className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
      >
        Check Answer
      </button>
    </div>
  );
};

export default MultipleChoiceQuestion;
