import io from "socket.io-client";

const serverUrl = import.meta.env.VITE_BACKEND_API_URL;
console.log("server URL", serverUrl)
export const initializeSocket = () => {
  const socket = io(serverUrl);

  socket.on("connect", () => {
    console.log("Connected to server via socket");
    socket.emit("start-audio", { contentType: "audio/webm" });
  });

  return socket;
};

export const startRecording = async (
  setRecording: (value: boolean) => void,
  setPaused: (value: boolean) => void,
  setTime: (value: number) => number,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  // @ts-expect-error it is working
  socketRef: React.MutableRefObject<SocketIOClient.Socket | null>
) => {
  socketRef.current = initializeSocket();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  streamRef.current = stream;
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  mediaRecorderRef.current = mediaRecorder;

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0 && socketRef.current) {
      event.data.arrayBuffer().then((buffer) => {
        socketRef.current?.emit("audio-chunk", buffer);
      });
    }
  };

  mediaRecorder.onstop = () => {
    if (socketRef.current) {
      socketRef.current.emit("stop-audio");
      socketRef.current.disconnect();
    }
  };

  mediaRecorder.start(500);
  setRecording(true);
  setPaused(false);
  setTime(0);
  // @ts-expect-error it is working
  intervalRef.current = setInterval(() => setTime((prev: number) => prev + 1), 1000);
};

export const pauseRecording = (
    setPaused: (value: boolean) => void,
    mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
    // @ts-expect-error it is working
    socketRef: React.MutableRefObject<SocketIOClient.Socket | null>
  ) => {
    if (mediaRecorderRef.current && socketRef.current) {
      mediaRecorderRef.current.pause();
      socketRef.current.emit("pause-audio"); // Inform the backend
      setPaused(true);
    }
  };

  export const resumeRecording = (
    setPaused: (value: boolean) => void,
    mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
    // @ts-expect-error it is working
    socketRef: React.MutableRefObject<SocketIOClient.Socket | null>
  ) => {
    if (mediaRecorderRef.current && socketRef.current) {
      mediaRecorderRef.current.resume();
      socketRef.current.emit("resume-audio"); // Inform the backend
      setPaused(false);
    }
  };  

export const stopRecording = (
  setRecording: (value: boolean) => void,
  setPaused: (value: boolean) => void,
  setShowModal: (value: boolean) => void,
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
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
