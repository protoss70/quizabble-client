import React, { useState, useRef } from "react";
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
  questionText = "Arrange the words in the correct order to form the sentence.",
}) => {
  // States for available words (bottom) and constructed sentence (top)
  const [availableWords, setAvailableWords] = useState<string[]>(words);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [attemptedCheck, setAttemptedCheck] = useState<boolean>(false);

  // Top container drop zone: accepts words from the available area.
  const [, topDrop] = useDrop<DragItem, void>({
    accept: "available",
    drop: (item) => {
      if (item.source === "available") {
        setAvailableWords((prev) => prev.filter((w) => w !== item.word));
        setConstructedSentence((prev) => [...prev, item.word]);
        setAttemptedCheck(false);
      }
    },
  });

  // Bottom container drop zone: accepts words from the constructed area.
  const [, bottomDrop] = useDrop<DragItem, void>({
    accept: "constructed",
    drop: (item) => {
      if (item.source === "constructed") {
        setConstructedSentence((prev) => prev.filter((w) => w !== item.word));
        setAvailableWords((prev) => [...prev, item.word]);
        setAttemptedCheck(false);
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

  // Clicking a word moves it to the opposite container and clears attemptedCheck.
  const moveToConstructed = (word: string) => {
    setAvailableWords((prev) => prev.filter((w) => w !== word));
    setConstructedSentence((prev) => [...prev, word]);
    setAttemptedCheck(false);
  };

  const moveToAvailable = (word: string) => {
    setConstructedSentence((prev) => prev.filter((w) => w !== word));
    setAvailableWords((prev) => [...prev, word]);
    setAttemptedCheck(false);
  };

  // Draggable & droppable component for available words.
  const AvailableWord: React.FC<{ word: string; index: number }> = ({ word, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
      type: "available",
      item: { word, source: "available", index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    const [, drop] = useDrop<DragItem, void>({
      accept: "available",
      hover(item, monitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        // Get bounding rectangle of the hovered element.
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        // Only reorder when the cursor has passed the midpoint.
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
        moveAvailableWord(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });
    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => moveToConstructed(word)}
        className={`p-2 rounded-md cursor-move ${
          attemptedCheck ? "border-2 border-red-500 text-red-600" : "border border-gray-300"
        }`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {word}
      </div>
    );
  };

  // Draggable & droppable component for constructed words.
  const ConstructedWord: React.FC<{ word: string; index: number }> = ({ word, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
      type: "constructed",
      item: { word, source: "constructed", index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    const [, drop] = useDrop<DragItem, void>({
      accept: "constructed",
      hover(item, monitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
        moveConstructedWord(dragIndex, hoverIndex);
        item.index = hoverIndex;
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

  // Check answer: if not all words are in the top container, return null and mark bottom words red.
  const checkAnswer = () => {
    if (availableWords.length > 0) {
      setIsAnswerCorrect(null);
      setAttemptedCheck(true);
      return;
    }
    const correct = JSON.stringify(constructedSentence) === JSON.stringify(answer);
    setIsAnswerCorrect(correct);
    setAttemptedCheck(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">{questionText}</h2>

      {/* Top drop zone: Constructed sentence area */}
      <div
        ref={topDrop}
        className="flex items-center p-4 space-x-2 border border-gray-300 min-h-[50px]"
      >
        {constructedSentence.length === 0 ? (
          <span className="leading-10 text-gray-500 h-11">
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
        className="flex justify-start w-full space-x-2 h-11"
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
