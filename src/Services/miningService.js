import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { createMiningCompletionNotification } from "./notificationService";
import { checkBadgeConditions } from './badgeService';
import { markMiningAsStreakActivity ,markMiningCompletionAsStreakActivity } from './streakService';

const DAILY_REWARD = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const startMiningSession = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    
    // Check if user can start mining (cooldown logic)
    const now = new Date();
    const nextAvailable = userData.mining?.nextAvailable;
    
    if (nextAvailable && now < nextAvailable.toDate()) {
      const timeRemaining = nextAvailable.toDate() - now;
      return { 
        success: false, 
        error: 'Mining on cooldown',
        timeRemaining 
      };
    }

    // Start mining session
    await updateDoc(userRef, {
      'mining.isMining': true,
      'mining.lastMiningStart': serverTimestamp(),
      'mining.coinsMined': 0,
      'profile.lastActive': serverTimestamp()
    });

    // **AUTOMATICALLY MARK TODAY'S STREAK** when mining starts
    await markMiningAsStreakActivity(uid);

    // Check badge conditions for mining started
    await checkBadgeConditions(uid, 'MINING_STARTED');

    return { success: true };
  } catch (error) {
    console.error('Error starting mining session:', error);
    return { success: false, error: error.message };
  }
};

export const updateMiningProgress = async (uid, coinsMined) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "mining.coinsMined": coinsMined,
      "stats.coinsEarned": coinsMined,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// In your completeMiningSession function
export const completeMiningSession = async (uid, finalCoins) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      'mining.isMining': false,
      'mining.coinsMined': finalCoins,
      'mining.totalMiningSessions': increment(1),
      'stats.totalCoinsEarned': increment(finalCoins),
      'mining.nextAvailable': null
    });

    // Create notification for completed mining session
    await createMiningCompletionNotification(uid, finalCoins);
    
    // **MARK MINING COMPLETION AS STREAK ACTIVITY**
    await markMiningCompletionAsStreakActivity(uid);
    
    // Check badge conditions for mining completed
    const userSnap = await getDoc(userRef);
    const totalSessions = userSnap.data()?.mining?.totalMiningSessions || 0;
    
    await checkBadgeConditions(uid, 'MINING_COMPLETED', { 
      totalSessions: totalSessions + 1 
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const subscribeToMiningUpdates = (uid, callback) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().mining);
    }
  });
};
