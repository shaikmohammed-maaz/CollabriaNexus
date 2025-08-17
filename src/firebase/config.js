import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // Copy these from your Firebase Console > Project Settings > General > Your apps
  apiKey: "AIzaSyDO5YcqXk5nhPT2OXyCScTamwmedBEFxTE",

  authDomain: "collabrianexus.firebaseapp.com",

  projectId: "collabrianexus",

  storageBucket: "collabrianexus.firebasestorage.app",

  messagingSenderId: "1047185526287",

  appId: "1:1047185526287:web:ada10cb1be8c92c0799d7a",

  measurementId: "G-PNZLHYBXYT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
export const enableOffline = () => disableNetwork(db);
export const enableOnline = () => enableNetwork(db);

export default app;
