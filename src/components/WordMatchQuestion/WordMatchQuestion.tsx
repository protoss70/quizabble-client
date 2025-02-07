import React, { useEffect, useState } from "react";

interface WordMatchQuestionProps {
  originalWords: string[];
  translatedWords: string[];
  questionText?: string;
  answer: string[][]; 
}

const WordMatchQuestion: React.FC<WordMatchQuestionProps> = ({
  originalWords,
  translatedWords,
  questionText = "Please match the words with their translations.",
  answer,
}) => {
  const [activeOriginal, setActiveOriginal] = useState<string | null>(null);
  const [activeTranslated, setActiveTranslated] = useState<string | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[][]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [incorrectMatches, setIncorrectMatches] = useState<string[][]>([]);

  const handleOriginalClick = (word: string) => {
    setActiveOriginal(word);
  };

  const handleTranslatedClick = (word: string) => {
    setActiveTranslated(word);
  };

  const checkAnswer = () => {
    if (activeOriginal && activeTranslated) {
      const isMatch = answer.some(
        (pair) =>
          (pair[0] === activeOriginal && pair[1] === activeTranslated) ||
          (pair[0] === activeTranslated && pair[1] === activeOriginal)
      );

      if (isMatch) {
        setMatchedWords((prev) => [...prev, [activeOriginal, activeTranslated]]);
        setIsAnswerCorrect(true);
      } else {
        setIncorrectMatches([[activeOriginal, activeTranslated]]);
        setIsAnswerCorrect(false);
    }
    
        setActiveOriginal(null);
        setActiveTranslated(null);
    }
  };

  useEffect(() => {
    if (activeOriginal && activeTranslated){
        checkAnswer();
    }
  }, [activeOriginal, activeTranslated])

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">{questionText}</h2>

      <div className="flex justify-between">
        <div className="flex flex-col space-y-2">
          {originalWords.map((word, index) => (
            <button
              key={index}
              id={`originalWord-${word}`}
              onClick={() => handleOriginalClick(word)}
              className={`w-32 px-4 py-2 border rounded ${
                activeOriginal === word
                  ? "bg-green-500 text-white"
                  : incorrectMatches.some(
                      (pair) => pair[0] === word && pair[1] === activeTranslated
                    )
                  ? "bg-red-500 text-white"
                  : "bg-white"
              } ${matchedWords.some(([matchedOriginal]) => matchedOriginal === word) ? "opacity-0" : ""}`}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-2">
          {translatedWords.map((word, index) => (
            <button
              key={index}
              id={`translatedWord-${word}`}
              onClick={() => handleTranslatedClick(word)}
              className={`w-32 px-4 py-2 border rounded ${
                activeTranslated === word
                  ? "bg-green-500 text-white"
                  : incorrectMatches.some(
                      (pair) => pair[0] === activeOriginal && pair[1] === word
                    )
                  ? "bg-red-500 text-white"
                  : "bg-white"
              } ${matchedWords.some(([, matchedTranslated]) => matchedTranslated === word) ? "opacity-0" : ""}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={checkAnswer}
        className="px-4 py-2 mt-4 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
      >
        Check Answer
      </button>

      {isAnswerCorrect !== null && (
        <p
        className={`mt-4 text-lg transition-opacity delay-1000 ${isAnswerCorrect ? "text-green-600 opacity-100" : "text-red-600 opacity-100"}`}
      >
        {isAnswerCorrect ? "Correct!" : "Incorrect. Try again!"}
      </p>
      )}
    </div>
  );
};

export default WordMatchQuestion;
