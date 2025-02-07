import React from "react";

interface OptionsSelectProps {
  options: string[];
  selectedOption: number | null;
  highlighted: boolean[];
  onSelect: (index: number) => void;
}

const OptionSelect: React.FC<OptionsSelectProps> = ({ options, selectedOption, highlighted, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`px-4 py-2 border rounded ${
            highlighted[index] ? "border-red-500 bg-red-100" : ""
          } ${selectedOption === index ? "bg-blue-500 text-white" : "bg-white"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default OptionSelect