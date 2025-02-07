import React, { useState } from "react";
import WaveForm from "../WaveForm/WaveForm";
import OptionSelect from "../OptionSelect/OptionSelect";

interface ListeningQuestionProps {
  audioSrc: string;
  options: string[];
  answer: number;
  questionText?: string;
  audioText?: string;
}

const ListeningQuestion: React.FC<ListeningQuestionProps> = ({
  audioSrc,
  options,
  answer,
  questionText = "What is the correct answer to the question above?",
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<boolean[]>(new Array(options.length).fill(false));

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setHighlighted(new Array(options.length).fill(false)); // Reset highlights
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
      {/* Waveform Display */}
      <WaveForm
        audioSrc={audioSrc}
        bordered={true} // or false, based on your requirement
      />
      <h2 className="text-lg font-semibold text-start">{questionText}</h2>

      <OptionSelect options={options} selectedOption={selectedOption} highlighted={highlighted} onSelect={handleSelect} />

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

export default ListeningQuestion;
