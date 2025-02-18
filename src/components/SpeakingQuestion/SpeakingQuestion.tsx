import React, { useEffect, useState } from "react";
import { playAnswerSoundFX } from "../../utils/soundFX";

interface SpeakingQuestionProps {
  /** The object containing the question details */
  questionObj: {
    type: string;
    question: string;
    questionText?: string;
  };
  setQuestionSolved: (on: boolean) => void;
}

const SpeakingQuestion: React.FC<SpeakingQuestionProps> = ({
  questionObj,
  setQuestionSolved
}) => {
  const { question, questionText = "Please pronounce the sentence written above" } = questionObj;
  
  const [recordedText, setRecordedText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (checkResult){
      setQuestionSolved(true);
    }
  }, [checkResult, setQuestionSolved])

  const startRecording = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line
    if (!SpeechRecognition) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    // Instantiate the recognition object
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      setRecordedText("");
      setCheckResult(null);
    };

    // @ts-expect-error dont do it
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Get the recognized transcript
      const transcript = event.results[0][0].transcript;
      setRecordedText(transcript);
      setIsRecording(false);
      checkAnswer(transcript);
    };

    recognition.onerror = (event: any) => { // eslint-disable-line
      setError("Error during recognition: " + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const checkAnswer = (transcript: string) => {
    // Normalize both strings (trim spaces and lower-case)
    const normalizedRecorded = transcript.trim().toLowerCase();
    const normalizedQuestion = question.trim().toLowerCase();
    const isCorrect = normalizedRecorded === normalizedQuestion;
    playAnswerSoundFX(isCorrect); 
    setCheckResult(normalizedRecorded === normalizedQuestion);
  };

  return (
    <div className="p-4 space-y-6">
      <p className="text-lg">{question}</p>
      <h2 className="text-lg font-semibold">{questionText}</h2>

      <button
        onClick={startRecording}
        disabled={isRecording}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        {isRecording ? "Recording..." : "Record"}
      </button>

      {recordedText && (
        <div className="mt-4">
          <p>
            <strong>Recorded Text:</strong> {recordedText}
          </p>
        </div>
      )}

      {checkResult !== null && (
        <div className="mt-4 text-lg">
          {checkResult ? (
            <span className="text-green-700">Correct!</span>
          ) : (
            <span className="text-red-700">Incorrect.</span>
          )}
        </div>
      )}

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default SpeakingQuestion;
