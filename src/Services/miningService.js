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
import { markMiningAsStreakActivity } from "./streakService";
import { checkBadgeConditions } from './badgeService';


const DAILY_REWARD = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const startMiningSession = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const now = new Date();
    const nextAvailable = new Date(now.getTime() + ONE_DAY_MS);

    await updateDoc(userRef, {
      "mining.isMining": true,
      "mining.lastMiningStart": serverTimestamp(),
      "mining.nextAvailable": nextAvailable,
      "mining.coinsMined": 0,
    });

    // Create mining session document
    const sessionRef = collection(db, "users", uid, "miningSessions");
    await addDoc(sessionRef, {
      startTime: serverTimestamp(),
      endTime: nextAvailable,
      coinsEarned: 0,
      status: "active",
    });

    await checkBadgeConditions(uid, "MINING_STARTED");

    return { success: true };
  } catch (error) {
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
export const completeMiningSession = async (uid, finalCoins) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "mining.isMining": false,
      "mining.coinsMined": finalCoins,
      "mining.totalMiningSessions": increment(1),
      "stats.totalCoinsEarned": increment(finalCoins),
      "mining.nextAvailable": null,
    });

    // Create notification for completed mining session
    await createMiningCompletionNotification(uid, finalCoins);

    // Mark mining completion as streak activity - ADD THIS LINE
    await markMiningAsStreakActivity(uid);

    // Check badge conditions for mining completed
    const userSnap = await getDoc(userRef);
    const totalSessions = userSnap.data()?.mining?.totalMiningSessions || 0;

    await checkBadgeConditions(uid, "MINING_COMPLETED", {
      totalSessions: totalSessions + 1,
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
