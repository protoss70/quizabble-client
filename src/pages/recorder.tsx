import React, { useState, useRef } from "react";
import { FaMicrophone, FaPause, FaStop } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import io from "socket.io-client";

const Recorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // @ts-expect-error it is working
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const serverUrl = "https://quizabble-server.vercel.app"; // your socket.io server URL

  const startRecording = async () => {
    // Connect to the backend via WebSocket
    socketRef.current = io(serverUrl);
    
    socketRef.current.on("connect", () => {
      console.log("Connected to server via socket");
      // Inform the server that audio will be sent
      socketRef.current?.emit("start-audio", { contentType: "audio/webm" });
    });

    // Get audio stream from the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;

    // When a chunk is available, send it over the socket
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socketRef.current) {
        event.data.arrayBuffer().then((buffer) => {
          socketRef.current?.emit("audio-chunk", buffer);
        });
      }
    };

    // When recording stops, emit the stop signal and disconnect
    mediaRecorder.onstop = () => {
      if (socketRef.current) {
        socketRef.current.emit("stop-audio");
        socketRef.current.disconnect();
      }
    };

    // Start recording with a 500ms timeslice to emit data regularly
    mediaRecorder.start(500);
    setRecording(true);
    setPaused(false);
    setTime(0);
    intervalRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (!paused) {
        mediaRecorderRef.current.pause();
      } else {
        mediaRecorderRef.current.resume();
      }
      setPaused(!paused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRecording(false);
    setPaused(false);
    setShowModal(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-96">
      <div className="flex flex-col items-center justify-center px-20 py-10 space-y-4 border-2 border-gray-600 rounded-lg w-min h-min">
        <h1 className="text-2xl font-bold">Voice Recorder</h1>
        <p className="text-lg">{time}s</p>
        {!recording ? (
          <Button variant="contained" color="error" onClick={startRecording}>
            <FaMicrophone size={24} />
          </Button>
        ) : (
          <div className="flex space-x-4">
            <Button variant="contained" color="warning" onClick={pauseRecording}>
              {paused ? <FaMicrophone size={24} /> : <FaPause size={24} />}
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setShowModal(true)}>
              <FaStop size={24} />
            </Button>
          </div>
        )}

        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>Do you really want to stop the recording?</DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button color="error" onClick={stopRecording}>
              Yes, Stop
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Recorder;
