// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Decode the Base64 environment variable and parse it into JSON
const firebaseConfigBase64 = process.env.FIREBASE_CONFIG_BASE64;

if (!firebaseConfigBase64) {
  throw new Error("FIREBASE_CONFIG_BASE64 environment variable is missing.");
}

const firebaseConfigJson = Buffer.from(firebaseConfigBase64, "base64").toString("utf-8");
const firebaseConfig = JSON.parse(firebaseConfigJson);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
