import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { completeMiningSession } from './miningService';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const initializeApp = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { sessionAutoCompleted: false };

    const userData = userSnap.data();

    // If a mining session exists and appears overdue, call the centralized, idempotent completion.
    if (userData.mining?.isMining && userData.mining?.lastMiningStart) {
      const start = userData.mining.lastMiningStart.toDate();
      const now = new Date();
      const elapsed = now.getTime() - start.getTime();
      if (elapsed >= ONE_DAY_MS) {
        const result = await completeMiningSession(uid);
        return { sessionAutoCompleted: !!result.success, coinsEarned: result.coinsEarned || 0 };
      }
    }

    return { sessionAutoCompleted: false };
  } catch (error) {
    console.error('Error initializing app:', error);
    return { sessionAutoCompleted: false, error: error.message };
  }
};

export default initializeApp;
