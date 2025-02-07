import React, { useEffect, useState } from "react";

interface WordMatchQuestionProps {
  originalWords: string[];
  translatedWords: string[];
  questionText?: string;
  answer: string[][]; 
}

interface PendingMatch {
  original: string;
  translated: string;
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
  const [pendingMatch, setPendingMatch] = useState<PendingMatch | null>(null);

  // When a word is clicked, clear any previous error state so that incorrect matches vanish.
  const handleOriginalClick = (word: string) => {
    if (incorrectMatches.length > 0 || isAnswerCorrect === false) {
      setIncorrectMatches([]);
      setIsAnswerCorrect(null);
    }
    setActiveOriginal(word);
  };

  const handleTranslatedClick = (word: string) => {
    if (incorrectMatches.length > 0 || isAnswerCorrect === false) {
      setIncorrectMatches([]);
      setIsAnswerCorrect(null);
    }
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
        setIsAnswerCorrect(true);
        // Set pending match so the buttons become green (with transition)
        setPendingMatch({ original: activeOriginal, translated: activeTranslated });
        // After 400ms, add them to matchedWords (which sets opacity to 0) and clear pending state.
        setTimeout(() => {
          setMatchedWords((prev) => [...prev, [activeOriginal, activeTranslated]]);
          setPendingMatch(null);
        }, 400);
      } else {
        // If the match is incorrect, mark them as incorrect.
        setIncorrectMatches([[activeOriginal, activeTranslated]]);
        setIsAnswerCorrect(false);
      }
      setActiveOriginal(null);
      setActiveTranslated(null);
    }
  };

  useEffect(() => {
    if (activeOriginal && activeTranslated) {
      checkAnswer();
    }
  }, [activeOriginal, activeTranslated]);

  // Reset function to clear all states.
  const resetMatches = () => {
    setActiveOriginal(null);
    setActiveTranslated(null);
    setMatchedWords([]);
    setIncorrectMatches([]);
    setIsAnswerCorrect(null);
    setPendingMatch(null);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">{questionText}</h2>

      <div className="flex justify-around">
        <div className="flex flex-col space-y-2">
          {originalWords.map((word, index) => (
            <button
              key={index}
              id={`originalWord-${word}`}
              onClick={() => handleOriginalClick(word)}
              className={`w-32 px-4 py-2 border rounded transition-all duration-[300ms] ${
                // Show green if this word is active or is part of a pending match.
                (activeOriginal === word || (pendingMatch && pendingMatch.original === word))
                  ? "bg-green-500 text-white"
                  : // If this word is part of an incorrect match (with the currently active translated word), show red.
                  incorrectMatches.some((pair) => pair[0] === word)
                  ? "bg-red-500 text-white"
                  : "bg-white"
              } ${
                // Fade out if the word has already been matched.
                matchedWords.some(([matchedOriginal]) => matchedOriginal === word)
                  ? "opacity-0 pointer-events-none"
                  : ""
              }`}
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
              className={`w-32 px-4 py-2 border rounded transition-all duration-[300ms] ${
                (activeTranslated === word || (pendingMatch && pendingMatch.translated === word))
                  ? "bg-green-500 text-white"
                  : incorrectMatches.some((pair) => pair[1] === word)
                  ? "bg-red-500 text-white"
                  : "bg-white"
              } ${
                matchedWords.some(([, matchedTranslated]) => matchedTranslated === word)
                  ? "opacity-0 pointer-events-none"
                  : ""
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {isAnswerCorrect !== null && (
        <p
          className={`mt-4 text-lg transition-opacity delay-1000 ${
            isAnswerCorrect ? "text-green-600 opacity-100" : "text-red-600 opacity-100"
          }`}
        >
          {isAnswerCorrect ? "Correct!" : "Incorrect. Try again!"}
        </p>
      )}

      <button
        onClick={resetMatches}
        className="px-4 py-2 mt-4 font-semibold text-white bg-gray-500 rounded hover:bg-gray-600"
      >
        Reset
      </button>
    </div>
  );
};

export default WordMatchQuestion;
