import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformDisplayProps {
  audioSrc: string;
  bordered: boolean;
}

const audioCache: { [key: string]: string } = {}; // Simple in-memory cache for audio URLs

const WaveForm: React.FC<WaveformDisplayProps> = ({ audioSrc, bordered }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize WaveSurfer on mount
  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4A90E2",
        barWidth: 2,
        height: 50,
        cursorWidth: 0,
      });

      // Check if the audio file is already cached
      let audioUrl = audioCache[audioSrc];

      // If not cached, add it to the cache
      if (!audioUrl) {
        audioUrl = `${audioSrc}?timestamp=${new Date().getTime()}`;
        audioCache[audioSrc] = audioUrl;
      }

      // Load the cached or new audio file URL
      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on("play", () => setIsPlaying(true));
      wavesurfer.current.on("finish", () => setIsPlaying(false));

      return () => wavesurfer.current?.destroy();
    }
  }, [audioSrc]);

  // Handle play/restart
  const handlePlay = () => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.stop(); // Stop audio
      }
      wavesurfer.current.seekTo(0); // Restart audio from the beginning
      wavesurfer.current.play(); // Play from the beginning
    }
  };

  const handleWaveformClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from triggering any other handlers
    handlePlay(); // Call the play function
  };

  return (
    <div
      className={`relative p-1 w-min ${bordered ? "border-2 border-gray-500 rounded-xl" : ""} ${
        isPlaying && bordered ? " bg-slate-100" : ""
      }`} // Add bg-slate-100 when playing and bordered
    >
      <button
        onClick={handlePlay}
        className="absolute p-2 text-white transform -translate-y-1/2 bg-blue-500 rounded-full shadow-md top-1/2 left-2 hover:bg-blue-600"
      >
        <i className="fa-solid fa-volume-high"></i>
      </button>
      <div
        ref={waveformRef}
        className="ml-12 w-36 hover:cursor-pointer"
        onClick={handleWaveformClick} // Add the onClick handler to the waveform
      ></div>
    </div>
  );
};

export default WaveForm;
