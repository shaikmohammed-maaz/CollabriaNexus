import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  getDoc,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { createMiningCompletionNotification } from "./notificationService";
import { checkBadgeConditions } from "./badgeService";
import { markMiningAsStreakActivity, markMiningCompletionAsStreakActivity } from "./streakService";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const startMiningSession = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists()) {
        throw new Error("User not found");
      }
      const data = snap.data();

      // Only allow if not already mining
      if (data.mining?.isMining) {
        throw new Error("Mining already in progress");
      }

      tx.update(userRef, {
        "mining.isMining": true,
        "mining.lastMiningStart": serverTimestamp(),
        "mining.coinsMined": 0,
        "mining.nextAvailable": null, // allow immediate start after completion
        "profile.lastActive": serverTimestamp(),
      });
    });

    await markMiningAsStreakActivity(uid);
    await checkBadgeConditions(uid, "MINING_STARTED");

    return { success: true };
  } catch (error) {
    console.error("Error starting mining session:", error);
    return { success: false, error: error.message };
  }
};

// Keep for visual progress only; do not modify stats here
export const updateMiningProgress = async (uid, coinsMined) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "mining.coinsMined": coinsMined,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const completeMiningSession = async (uid) => {
  try {
    // Get server time once to avoid client clock skew
    const serverTimeDoc = await addDoc(collection(db, "serverTime"), { ts: serverTimestamp() });
    const serverTimeSnap = await getDoc(serverTimeDoc);
    const serverNow = serverTimeSnap.data().ts.toDate();

    const userRef = doc(db, "users", uid);
    let coinsEarned = 0;

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists()) {
        throw new Error("User not found");
      }

      const data = snap.data();
      if (!data.mining?.isMining || !data.mining?.lastMiningStart) {
        // Idempotent no-op: another tab might have already completed
        coinsEarned = 0;
        return;
      }

      const startTime = data.mining.lastMiningStart.toDate();
      const elapsedMs = serverNow - startTime;
      const miningRate = data.mining.miningRate || 3.0; // coins per day
      const cappedElapsed = Math.min(Math.max(elapsedMs, 0), ONE_DAY_MS);
      coinsEarned = parseFloat(((cappedElapsed / ONE_DAY_MS) * miningRate).toFixed(1));

      tx.update(userRef, {
        "stats.coinsEarned": increment(coinsEarned),
        "stats.totalCoinsEarned": increment(coinsEarned),
        "mining.coinsMined": 0,
        "mining.totalMiningSessions": increment(1),
        "mining.isMining": false,
        "mining.lastMiningStart": null,
        "mining.nextAvailable": null, // no cooldown; immediate restart allowed
      });
    });

    if (coinsEarned > 0) {
      // Side-effects after the atomic update
      await createMiningCompletionNotification(uid, coinsEarned);
      await markMiningCompletionAsStreakActivity(uid);
      await checkBadgeConditions(uid, "MINING_COMPLETED");
    }

    return { success: true, coinsEarned };
  } catch (error) {
    console.error("Error completing mining session:", error);
    return { success: false, error: error.message };
  }
};

export const subscribeToMiningUpdates = (uid, callback) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().mining);
    }
  });
};
