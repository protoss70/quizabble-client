import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import WaveForm from "../WaveForm/WaveForm";

interface RearrangementQuestionProps {
  question: {
    type: "rearrangement-listening" | "rearrangement";
    question: string;
    solution: string;
    options: string[];
  };
}

interface DragItem {
  word: string;
  source: "available" | "constructed";
  index: number;
}

const RearrangementQuestion: React.FC<RearrangementQuestionProps> = ({ question }) => {
  const { solution, options, question: questionText } = question;
  const answer = solution.split(" ");

  // State initialization
  const [availableWords, setAvailableWords] = useState<string[]>(options);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Reset state when the question prop changes
  useEffect(() => {
    setAvailableWords(options);
    setConstructedSentence([]);
    setIsAnswerCorrect(null);
  }, [question, options]);

  const [, topDrop] = useDrop<DragItem, void>({
    accept: "available",
    drop: (item) => {
      if (item.source === "available") {
        setAvailableWords((prev) => prev.filter((w) => w !== item.word));
        setConstructedSentence((prev) => [...prev, item.word]);
      }
    },
  });

  const [, bottomDrop] = useDrop<DragItem, void>({
    accept: "constructed",
    drop: (item) => {
      if (item.source === "constructed") {
        setConstructedSentence((prev) => prev.filter((w) => w !== item.word));
        setAvailableWords((prev) => [...prev, item.word]);
      }
    },
  });

  const moveConstructedWord = (dragIndex: number, hoverIndex: number) => {
    const newList = [...constructedSentence];
    const [removed] = newList.splice(dragIndex, 1);
    newList.splice(hoverIndex, 0, removed);
    setConstructedSentence(newList);
  };

  const moveAvailableWord = (dragIndex: number, hoverIndex: number) => {
    const newList = [...availableWords];
    const [removed] = newList.splice(dragIndex, 1);
    newList.splice(hoverIndex, 0, removed);
    setAvailableWords(newList);
  };

  const moveToConstructed = (word: string) => {
    setAvailableWords((prev) => prev.filter((w) => w !== word));
    setConstructedSentence((prev) => [...prev, word]);
  };

  const moveToAvailable = (word: string) => {
    setConstructedSentence((prev) => prev.filter((w) => w !== word));
    setAvailableWords((prev) => [...prev, word]);
  };

  const AvailableWord: React.FC<{ word: string; index: number }> = ({ word, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "available",
      item: { word, source: "available", index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    const [, drop] = useDrop<DragItem, void>({
      accept: "available",
      hover(item) {
        if (item.index === index) return;
        moveAvailableWord(item.index, index);
        item.index = index;
      },
    });
    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => moveToConstructed(word)}
        className="p-2 border border-gray-300 rounded-md cursor-move"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {word}
      </div>
    );
  };

  const ConstructedWord: React.FC<{ word: string; index: number }> = ({ word, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "constructed",
      item: { word, source: "constructed", index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    const [, drop] = useDrop<DragItem, void>({
      accept: "constructed",
      hover(item) {
        if (item.index === index) return;
        moveConstructedWord(item.index, index);
        item.index = index;
      },
    });
    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => moveToAvailable(word)}
        className="p-2 border border-gray-300 rounded-md cursor-move"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {word}
      </div>
    );
  };

  const checkAnswer = () => {
    const correct =
      constructedSentence.map((w) => w.toLowerCase()).join(" ") ===
      answer.map((w) => w.toLowerCase()).join(" ");
    setIsAnswerCorrect(correct);
  };

  return (
    <div className="p-4 space-y-6">
      {question.type === "rearrangement-listening" ? (
        <WaveForm audioSrc={questionText} bordered={true} />
      ) : (
        <h2 className="text-lg font-semibold">{questionText}</h2>
      )}

      <div
        ref={topDrop}
        className="flex items-center p-4 h-14 space-x-2 border border-gray-300 min-h-[50px]"
      >
        {constructedSentence.length === 0 ? (
          <span className="text-gray-500">
            Click or drag words here to form the sentence
          </span>
        ) : (
          constructedSentence.map((word, index) => (
            <ConstructedWord key={index} word={word} index={index} />
          ))
        )}
      </div>

      <div ref={bottomDrop} className="flex space-x-2 h-11">
        {availableWords.map((word, index) => (
          <AvailableWord key={index} word={word} index={index} />
        ))}
      </div>

      <button
        onClick={checkAnswer}
        className="px-4 py-2 mt-4 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
      >
        Check Answer
      </button>

      {isAnswerCorrect !== null && (
        <p className={`mt-4 text-lg ${isAnswerCorrect ? "text-green-600" : "text-red-600"}`}>
          {isAnswerCorrect ? "Correct!" : "Incorrect. Try again!"}
        </p>
      )}
    </div>
  );
};

export default RearrangementQuestion;
