import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  signInWithEmailAndPasswordHandler,
  registerWithEmailAndPasswordHandler,
  signInWithGoogleHandler,
  signOutHandler,
  getCurrentUser,
  isAuthenticated,
  sendPasswordResetEmailHandler
} from '../services/auth';
import { User } from 'firebase/auth';

// Define the shape of your context data
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with the initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    // Check for authenticated user when the component mounts
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        const user = getCurrentUser();
        setCurrentUser(user);
      }
    };
    checkAuthStatus();
  }, []);

  // Function to handle login with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPasswordHandler(email, password);
      const user = getCurrentUser();
      setCurrentUser(user);
      setIsAuth(true);
      return user;
    } catch (error) {
      console.error('Failed to log in:', error);
      throw error;
    }
  };

  // Function to handle registration with email and password
  const register = async (email: string, password: string) => {
    try {
      await registerWithEmailAndPasswordHandler(email, password);
      const user = getCurrentUser();
      setCurrentUser(user);
      setIsAuth(true);
      return user;
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  };

  // Function to handle login with Google
  const loginWithGoogle = async () => {
    try {
      await signInWithGoogleHandler();
      const user = getCurrentUser();
      setCurrentUser(user);
      setIsAuth(true);
      return user;
    } catch (error) {
      console.error('Failed to log in with Google:', error);
      throw error;
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await signOutHandler();
      setCurrentUser(null);
      setIsAuth(false);
    } catch (error) {
      console.error('Failed to log out:', error);
      throw error;
    }
  };

  // Function to send password reset email
  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmailHandler(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  // Context value to provide
  const contextValue: AuthContextType = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    sendPasswordResetEmail,
    isAuthenticated: isAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
