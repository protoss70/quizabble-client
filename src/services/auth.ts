import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, UserCredential, signOut as firebaseSignOut, onAuthStateChanged, User, sendPasswordResetEmail } from "firebase/auth";
import { app } from './firebase'; // Import initialized Firebase app

const auth = getAuth(app);

// Function for email and password login
export const signInWithEmailAndPasswordHandler = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

// Function for email and password registration
export const registerWithEmailAndPasswordHandler = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error registering with email and password:', error);
    throw error;
  }
};

// Function for Google login
export const signInWithGoogleHandler = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Function for signing out
export const signOutHandler = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Function to get the current authenticated user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Function to check if the user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(!!user);
      unsubscribe(); // Clean up the listener
    });
  });
};

// Function to send password reset email
export const sendPasswordResetEmailHandler = async (email: string): Promise<void> => {
  try {

    const actionCodeSettings = {
      url: 'http://localhost:5173/',
      handleCodeInApp: false
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings); // Use the Firebase method
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
