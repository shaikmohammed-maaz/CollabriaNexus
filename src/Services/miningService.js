import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { createMiningCompletionNotification } from "./notificationService";
import { checkBadgeConditions } from './badgeService';
import { markMiningAsStreakActivity ,markMiningCompletionAsStreakActivity } from './streakService';
import { increment } from "firebase/firestore";

export const startMiningSession = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    // Only allow if not already mining
    if (userSnap.data().mining?.isMining) {
      return { success: false, error: 'Mining already in progress' };
    }

    await updateDoc(userRef, {
      'mining.isMining': true,
      'mining.lastMiningStart': serverTimestamp(),
      'mining.coinsMined': 0,
      'profile.lastActive': serverTimestamp()
    });

    await markMiningAsStreakActivity(uid);
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
export const completeMiningSession = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false, error: 'User not found' };

    const userData = userSnap.data();
    if (!userData.mining?.isMining || !userData.mining?.lastMiningStart) {
      return { success: false, error: 'No mining session in progress' };
    }

    // Get server time
    const serverTimeDoc = await addDoc(collection(db, 'serverTime'), { ts: serverTimestamp() });
    const serverTimeSnap = await getDoc(serverTimeDoc);
    const serverNow = serverTimeSnap.data().ts.toDate();

    const startTime = userData.mining.lastMiningStart.toDate();
    const elapsedMs = serverNow - startTime;
    const miningRate = userData.mining.miningRate || 3.0;
    const maxSessionMs = 24 * 60 * 60 * 1000;
    const cappedElapsed = Math.min(elapsedMs, maxSessionMs);
    const coinsEarned = parseFloat(((cappedElapsed / maxSessionMs) * miningRate).toFixed(1));

    await updateDoc(userRef, {
      'stats.coinsEarned': increment(coinsEarned),
      'stats.totalCoinsEarned': increment(coinsEarned),
      'mining.coinsMined': 0,
      'mining.totalMiningSessions': increment(1),
      'mining.isMining': false,
      'mining.lastMiningStart': null,
      'mining.nextAvailable': null // or set cooldown timestamp if needed
    });

    await createMiningCompletionNotification(uid, coinsEarned);
    await markMiningCompletionAsStreakActivity(uid);
    await checkBadgeConditions(uid, 'MINING_COMPLETED', {
      totalSessions: (userData.mining.totalMiningSessions || 0) + 1
    });

    return { success: true, coinsEarned };
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
