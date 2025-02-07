import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface RearrangementQuestionProps {
  words: string[];
  answer: string[];
  questionText?: string;
}

interface DragItem {
  word: string;
  source: "available" | "constructed";
  index: number;
}

const RearrangementQuestion: React.FC<RearrangementQuestionProps> = ({
  words,
  answer,
  questionText = "Arrange the words to form the correct sentence.",
}) => {
  // States for available words (bottom) and constructed sentence (top)
  const [availableWords, setAvailableWords] = useState<string[]>(words);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showRedOutline, setShowRedOutline] = useState(false);

  // Container drop zones allow words to be dropped into an empty area
  // Top container accepts "available" words to add them to the constructed sentence.
  const [, topDrop] = useDrop<DragItem, void>({
    accept: "available",
    drop: (item) => {
      if (item.source === "available") {
        setAvailableWords((prev) => prev.filter((w) => w !== item.word));
        setConstructedSentence((prev) => [...prev, item.word]);
      }
    },
  });

  // Bottom container accepts "constructed" words to move them back to available.
  const [, bottomDrop] = useDrop<DragItem, void>({
    accept: "constructed",
    drop: (item) => {
      if (item.source === "constructed") {
        setConstructedSentence((prev) => prev.filter((w) => w !== item.word));
        setAvailableWords((prev) => [...prev, item.word]);
      }
    },
  });

  // Functions to reorder words within the same container
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

  // Clicking a word moves it to the other container
  const moveToConstructed = (word: string) => {
    setAvailableWords((prev) => prev.filter((w) => w !== word));
    setConstructedSentence((prev) => [...prev, word]);
    setShowRedOutline(false); // Reset the red outline
  };

  const moveToAvailable = (word: string) => {
    setConstructedSentence((prev) => prev.filter((w) => w !== word));
    setAvailableWords((prev) => [...prev, word]);
    setShowRedOutline(false);
  };

  // Draggable & droppable component for available words
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
        className={`p-2 border border-gray-300 rounded-md cursor-move ${showRedOutline ? "border-red-500" : ""}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {word}
      </div>
    );
  };

  // Draggable & droppable component for constructed words
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
    if (availableWords.length > 0) {
      setShowRedOutline(true);
      return;
    }
    const correct = JSON.stringify(constructedSentence) === JSON.stringify(answer);
    setIsAnswerCorrect(correct);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">{questionText}</h2>

      {/* Top drop zone: Constructed sentence area */}
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

      {/* Bottom drop zone: Available words area */}
      <div
        ref={bottomDrop}
        className="flex space-x-2 h-11"
      >
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
        <p
          className={`mt-4 text-lg ${
            isAnswerCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isAnswerCorrect ? "Correct!" : "Incorrect. Try again!"}
        </p>
      )}
    </div>
  );
};

export default RearrangementQuestion;
