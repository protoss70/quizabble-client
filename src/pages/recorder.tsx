import React, { useState, useRef, useEffect } from "react";
import { startRecording, stopRecording, pauseRecording, resumeRecording } from "../api/sockets/audio_streaming";

const Recorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // @ts-expect-error it is working
  const socketRef = useRef<React.MutableRefObject<SocketIOClient.Socket | null>>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Draw waveform based on current state
  const drawWaveform = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Create gradient for waveform
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#3b82f6');  // Blue
    gradient.addColorStop(0.5, '#8b5cf6'); // Purple
    gradient.addColorStop(1, '#ec4899');   // Pink
    
    const draw = () => {
      if (!ctx) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // If paused, draw static bars
      if (paused) {
        const barCount = 30;
        const barWidth = (width / barCount) - 1;
        
        for (let i = 0; i < barCount; i++) {
          // Generate a static pattern when paused
          const barHeight = Math.sin(i * 0.2) * 10 + 5;
          ctx.fillStyle = gradient;
          ctx.fillRect(i * (barWidth + 1), height / 2 - barHeight / 2, barWidth, barHeight);
        }
      } 
      // If recording and not paused, draw dynamic waveform
      else if (recording && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        const barWidth = width / dataArrayRef.current.length * 2.5;
        let x = 0;
        
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = (dataArrayRef.current[i] / 255) * height / 2;
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
          
          x += barWidth + 1;
          if (x > width) break;
        }
      } 
      // If not recording, draw an idle waveform
      else {
        const barCount = 30;
        const barWidth = (width / barCount) - 1;
        
        for (let i = 0; i < barCount; i++) {
          // Generate a subtle idle pattern
          const barHeight = 2;
          ctx.fillStyle = gradient;
          ctx.fillRect(i * (barWidth + 1), height / 2 - barHeight / 2, barWidth, barHeight);
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start the animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    draw();
  };

  // Set up audio analyzer when recording starts
  useEffect(() => {
    if (recording && streamRef.current) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
        source.connect(analyserRef.current);
        
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      }
      
      drawWaveform();
    } else if (!recording) {
      // Clean up audio context when not recording
      drawWaveform(); // Draw idle state
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [recording]);

  // Update waveform when paused state changes
  useEffect(() => {
    if (recording) {
      drawWaveform();
    }
  }, [paused]);

  // Enhanced start recording function
  const handleStartRecording = async () => {
    try {
      await startRecording(
        setRecording, 
        setPaused, 
        // @ts-expect-error it is working
        setTime, 
        intervalRef, 
        mediaRecorderRef, 
        streamRef, 
        socketRef
      );
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handlePauseResume = () => {
    if (paused) {
      resumeRecording(setPaused, mediaRecorderRef, socketRef);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      pauseRecording(setPaused, mediaRecorderRef, socketRef);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
  

  // Enhanced stop recording function
  const handleStopRecording = () => {
    stopRecording(
      setRecording, 
      setPaused, 
      setShowConfirmDialog, 
      mediaRecorderRef, 
      streamRef, 
      intervalRef
    );
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Draw idle state
    setTimeout(() => {
      drawWaveform();
    }, 100);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <div className="w-full max-w-sm rounded-3xl bg-[#121836] overflow-hidden shadow-lg">
        {/* Time and status display */}
        <div className="px-6 pt-10 pb-6 text-center">
          
          {/* Microphone icon */}
          <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-28 h-28 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
            <svg className="w-16 h-16 text-gray-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.35 9.65V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Recording name and time */}
          <div className="mb-1 text-xl font-medium text-blue-400">Voice Recorder</div>
          <div className="text-lg text-pink-500">{formatTime(time)}</div>
        </div>
        
        {/* Waveform visualization */}
        <div className="px-6 py-4">
          <canvas 
            ref={canvasRef} 
            className="w-full h-12" 
            width={300} 
            height={48}
          />
        </div>
        
        {/* Controls */}
        <div className="flex flex-col items-center px-6 pb-6 space-y-4">
          {recording ? (
            <>
              {/* Pause button */}
              <button
                onClick={handlePauseResume}
                className="flex items-center justify-center w-16 h-16 transition-all bg-blue-500 rounded-full hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                {paused ? (
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6">
                    <div className="w-2 h-6 mr-2 bg-white rounded-sm"></div>
                    <div className="w-2 h-6 bg-white rounded-sm"></div>
                  </div>
                )}
              </button>
              
              {/* Stop button */}
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="w-full py-3 font-medium text-white transition-all rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 active:scale-98 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
              >
                Finish Recording
              </button>
            </>
          ) : (
            <button
              onClick={handleStartRecording}
              className="flex items-center justify-center w-16 h-16 transition-all bg-blue-500 rounded-full hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </button>
          )}
          
        </div>
      </div>
      
      {/* Stop confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg">
            <h3 className="mb-4 text-xl font-medium text-white">Are you sure?</h3>
            <p className="mb-6 text-gray-300">Do you really want to stop the recording?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-white transition-colors bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleStopRecording}
                className="px-4 py-2 text-white transition-colors bg-pink-600 rounded hover:bg-pink-700"
              >
                Yes, Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recorder;