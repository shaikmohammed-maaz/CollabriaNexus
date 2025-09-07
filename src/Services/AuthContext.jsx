import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange } from './authService';
import { getUserProfile, updateLastActive } from './userService';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let unsubProfile = null;

  const unsubscribeAuth = onAuthChange(async (user) => {
    setCurrentUser(user);

    if (user) {
      // Subscribe to Firestore doc in real time
      unsubProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setUserProfile(null);
        }
      });

      // Update last active (fire and forget)
      updateLastActive(user.uid);
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  });

  // Cleanup function for useEffect
  return () => {
    if (unsubProfile) unsubProfile();
    unsubscribeAuth(); // stop listening to auth
  };
}, []);
  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
