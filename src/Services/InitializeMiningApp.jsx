import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createMiningCompletionNotification } from './notificationService';
import { markMiningCompletionAsStreakActivity } from './streakService';
import { checkBadgeConditions } from './badgeService';


const DAILY_REWARD = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const initializeApp = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
  
    
    if (!userSnap.exists()) return;
    
    const userData = userSnap.data();
    const now = new Date();
    
    // Check for abandoned mining sessions
    if (userData.mining?.isMining && userData.mining?.lastMiningStart) {
      const miningStartTime = userData.mining.lastMiningStart.toDate();
      const timeSinceStart = now - miningStartTime;
      const MAX_MINING_DURATION = 24 * 60 * 60 * 1000; // 24 hours
      
      if (timeSinceStart >= MAX_MINING_DURATION) {
        // Auto-complete abandoned session
        const coinsMined = userData.mining?.coinsMined || DAILY_REWARD;
        
        await updateDoc(userRef, {
          'mining.isMining': false,
          'mining.coinsMined': coinsMined,
          'mining.totalMiningSessions': increment(1),
          'stats.totalCoinsEarned': increment(coinsMined),
          'mining.nextAvailable': new Date(now.getTime() + ONE_DAY_MS)
        });
        
        // Complete all the necessary updates
        await createMiningCompletionNotification(uid, coinsMined);
        await markMiningCompletionAsStreakActivity(uid);
        await checkBadgeConditions(uid, 'MINING_COMPLETED', { 
          totalSessions: (userData.mining?.totalMiningSessions || 0) + 1 
        });

        console.log("Completed")
        
        return { sessionAutoCompleted: true, coinsEarned: coinsMined };
      }
    }
    
    console.log("incpmplete")
    
    return { sessionAutoCompleted: false };
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};


export default initializeApp;