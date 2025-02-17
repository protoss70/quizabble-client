import React, { useState } from "react";

interface FillInTheBlankQuestion {
  type: "fillInTheBlank";
  question: string;
  text: string;
  solution: string[];
  options: string[];
}

interface Props {
  question: FillInTheBlankQuestion;
  dev?: boolean;
}

const FillInTheBlank: React.FC<Props> = ({ question, dev=true }) => {
  const { text, solution, options } = question;

  const blanks = text.split("_");
  const [userAnswers, setUserAnswers] = useState<string[]>(
    solution.map(() => "")
  );
  const [highlighted, setHighlighted] = useState<boolean[]>(
    solution.map(() => false)
  );
  const [checkResult, setCheckResult] = useState<boolean | null>(null);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    setHighlighted(solution.map(() => false));
  };

  const handleOptionClick = (option: string) => {
    const emptyIndex = userAnswers.findIndex((ans) => ans === "");
    if (userAnswers.includes(option)) {
      const newAnswers = userAnswers.map((ans) => (ans === option ? "" : ans));
      setUserAnswers(newAnswers);
    } else if (emptyIndex !== -1) {
      handleChange(emptyIndex, option);
    }
  };

  const checkAnswers = (): boolean | null => {
    if (userAnswers.some((ans) => ans === "")) {
      setHighlighted(userAnswers.map((ans) => ans === ""));
      setCheckResult(null);
      return null;
    }
    setHighlighted(solution.map(() => false));
    const isCorrect = userAnswers.every((ans, i) => ans === solution[i]);
    setCheckResult(isCorrect);
    return isCorrect;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-start">{question.question}</h2>
      <p className="text-lg text-start">
        {blanks.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < solution.length && (
              <input
                type="text"
                value={userAnswers[index]}
                readOnly
                className={`w-20 px-2 py-1 mx-2 text-center border rounded bg-gray-100 cursor-not-allowed ${
                  highlighted[index] ? "border-red-500 bg-red-100" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </p>

      <div className="flex flex-col items-center gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`px-4 py-2 border rounded hover:brightness-90 w-32 text-center ${
              userAnswers.includes(option) ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
        {dev ? 
          <>
            <button
              onClick={() => {
                setHighlighted(solution.map(() => false));
                checkAnswers();
              }}
              className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
            >
              Check Answers
            </button>
            {checkResult !== null && (
              <span className="block mt-4 text-lg">
                {checkResult ? "True" : "False"}
              </span>
            )}
            {checkResult === null && (
              <span className="block mt-4 text-lg">Null</span>
            )}
          </>
        :
        <></>  
      }

    </div>
  );
};

export default FillInTheBlank;
