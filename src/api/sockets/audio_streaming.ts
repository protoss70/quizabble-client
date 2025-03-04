import io from "socket.io-client";

const serverUrl = import.meta.env.VITE_BACKEND_API_URL;
console.log("server URL", serverUrl);

// Track chunks and their indexes
const pendingChunks: Map<number, { buffer: number[]; hash: string }> = new Map();
let lastSentChunkIndex = -1;
let lastConfirmedChunkIndex = -1;
let isReconnecting = false;

export const initializeSocket = (onReconnect?: () => void) => {
  const socket = io(serverUrl, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  let fileKey = localStorage.getItem("fileKey");
  if (!fileKey) {
    const timestamp = Date.now();
    fileKey = `class_recordings/${timestamp}.webm`;
    localStorage.setItem("fileKey", fileKey);
  }

  socket.on("connect", () => {
    console.log("✅ Connected to server via socket");
    console.log(`📂 Sending fileKey: ${fileKey}`);
    socket.emit("start-audio", { contentType: "audio/webm", fileKey });
  });

  socket.on("reconnect", () => {
    console.log("🔄 Reconnected to server");
    isReconnecting = true;
    socket.emit("resume-audio", { fileKey });

    if (onReconnect) {
      onReconnect();
    }
  });

  socket.on("chunk-index", (data: { lastChunkIndex: number }) => {
    console.log(`📡 Server confirmed last received chunk: ${data.lastChunkIndex}`);

    // Update last confirmed index
    lastConfirmedChunkIndex = data.lastChunkIndex;
    
    // Ensure lastSentChunkIndex matches the last confirmed index
    if (lastSentChunkIndex < lastConfirmedChunkIndex) {
      console.log(`🔄 Resyncing chunk index from ${lastSentChunkIndex} to ${lastConfirmedChunkIndex}`);
      lastSentChunkIndex = lastConfirmedChunkIndex;
    }

    // Resend only missing chunks
    for (const [chunkIndex, chunkData] of pendingChunks) {
      if (chunkIndex > lastConfirmedChunkIndex) {
        console.log(`🔁 Resending chunk ${chunkIndex}`);
        socket.emit("audio-chunk", { ...chunkData, chunkIndex });
      }
    }

    // Remove confirmed chunks
    for (const chunkIndex of Array.from(pendingChunks.keys())) {
      if (chunkIndex <= lastConfirmedChunkIndex) {
        pendingChunks.delete(chunkIndex);
      }
    }

    isReconnecting = false;
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
  // @ts-expect-error ignore pls
  socketRef: React.MutableRefObject<SocketIOClient.Socket | null>
) => {
  socketRef.current = initializeSocket();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  streamRef.current = stream;
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  mediaRecorderRef.current = mediaRecorder;

  async function generateSHA256(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  mediaRecorder.ondataavailable = async (event) => {
    if (event.data.size > 0 && socketRef.current) {
      const rawArrayBuffer = await event.data.arrayBuffer();
      const hash = await generateSHA256(rawArrayBuffer);
      const byteArray = Array.from(new Uint8Array(rawArrayBuffer));

      // Ensure we sync with server's chunk index
      if (isReconnecting) {
        console.log(`🔄 Skipping new chunks until reconnection is complete`);
        return;
      }

      lastSentChunkIndex += 1;
      const chunkIndex = lastSentChunkIndex;

      const chunkData = { buffer: byteArray, hash, chunkIndex };
      pendingChunks.set(chunkIndex, chunkData);
      if (pendingChunks.size > 100) {
        const keysToRemove = Array.from(pendingChunks.keys()).sort((a, b) => a - b).slice(0, 25);
        keysToRemove.forEach((key) => pendingChunks.delete(key));
        console.log("25 Cleared chunks")
      }

      console.log(`📤 Sending chunk ${chunkIndex}`);
      socketRef.current.emit("audio-chunk", chunkData);
    }
  };

  mediaRecorder.onstop = () => {
    if (socketRef.current) {
      socketRef.current.emit("stop-audio");
      socketRef.current.disconnect();
    }
    localStorage.removeItem("fileKey");
  };

  mediaRecorder.start(500);
  setRecording(true);
  setPaused(false);
  setTime(0);
  // @ts-expect-error ignore pls
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
    socketRef.current.emit("pause-audio");
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
    socketRef.current.emit("resume-audio");
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
