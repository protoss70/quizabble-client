// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaPCPPFY8_zi4lJDd9BtCju_XL_C8c-cY",
  authDomain: "quizabble.firebaseapp.com",
  projectId: "quizabble",
  storageBucket: "quizabble.firebasestorage.app",
  messagingSenderId: "508178819548",
  appId: "1:508178819548:web:89862b04367dda1a580719",
  measurementId: "G-JXDMJCQBYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }