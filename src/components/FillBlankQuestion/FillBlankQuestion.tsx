import React, { useState } from "react";

interface FillInTheBlankProps {
  question?: string;
  text: string;
  answers: string[];
  options?: string[][];
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  question = "Please fill in the blanks with the correct answer.",
  text,
  answers,
  options,
}) => {
  const blanks = text.split("_");
  const [userAnswers, setUserAnswers] = useState<string[]>(answers.map(() => ""));
  const [highlighted, setHighlighted] = useState<boolean[]>(answers.map(() => false));
  const [checkResult, setCheckResult] = useState<boolean | null>(null);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    setHighlighted(answers.map(() => false)); // Reset highlights on input change
  };

  const checkAnswers = (): boolean | null => {
    if (userAnswers.some((ans) => ans === "")) {
      setHighlighted(userAnswers.map((ans) => ans === ""));
      setCheckResult(null);
      return null;
    }
    setHighlighted(answers.map(() => false));
    const isCorrect = userAnswers.every((ans, i) => ans === answers[i]);
    setCheckResult(isCorrect);
    return isCorrect;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-start">{question}</h2>
      <p className="text-lg text-start">
        {blanks.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < answers.length && (
              <input
                type="text"
                value={userAnswers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className={`w-20 px-2 py-1 mx-2 text-center border rounded ${
                  highlighted[index] ? "border-red-500 bg-red-100" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </p>

      {options && (
        <div className="space-y-2">
          {options[0].map((_, i) => (
            <div key={i} className="flex justify-center gap-2">
              <div className="flex items-center justify-center">
              </div>
              {options.map((group) => (
                <button
                  key={group[i]}
                  onClick={() => handleChange(i, group[i])}
                  className={`px-3 flex-1 max-w-36 py-1 border rounded hover:brightness-90 ${
                    userAnswers[i] === group[i] ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {group[i]}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          setHighlighted(answers.map(() => false)); // Reset highlights when checking answers
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
    </div>
  );
};

export default FillInTheBlank;
