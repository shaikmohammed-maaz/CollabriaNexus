import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { checkBadgeConditions } from './badgeService';
import { createStreakMilestoneNotification } from './notificationService';

// Get user's streak data for a specific month
export const getStreakData = async (uid, year, month) => {
  try {
    const streakRef = collection(db, 'users', uid, 'streakData');
    const q = query(
      streakRef,
      where('date', '>=', `${year}-${month.toString().padStart(2, '0')}-01`),
      where('date', '<=', `${year}-${month.toString().padStart(2, '0')}-31`)
    );
    
    const snapshot = await getDocs(q);
    const streakData = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      streakData[data.date] = {
        completed: data.completed,
        activities: data.activities || []
      };
    });
    
    return { success: true, streakData };
  } catch (error) {
    console.error('Error getting streak data:', error);
    return { success: false, error: error.message, streakData: {} };
  }
};

// Mark today as completed
export const markTodayComplete = async (uid, activities = []) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    
    await setDoc(streakRef, {
      date: today,
      completed: true,
      activities,
      timestamp: serverTimestamp()
    }, { merge: true });
    
    // Update user's current streak
    const newStreak = await calculateCurrentStreak(uid);
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      'stats.currentStreak': newStreak
    });
    
    // Check for streak milestones and badges
    await checkStreakMilestones(uid, newStreak);
    
    return { success: true, newStreak };
  } catch (error) {
    console.error('Error marking day complete:', error);
    return { success: false, error: error.message };
  }
};

// Calculate current streak
const calculateCurrentStreak = async (uid) => {
  try {
    const streakRef = collection(db, 'users', uid, 'streakData');
    const snapshot = await getDocs(streakRef);
    
    const completedDates = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.completed) {
        completedDates.push(data.date);
      }
    });
    
    // Sort dates in descending order
    completedDates.sort().reverse();
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (const dateStr of completedDates) {
      const date = new Date(dateStr);
      const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0 || daysDiff === 1) {
        streak++;
        currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

// Check for streak milestones
const checkStreakMilestones = async (uid, streak) => {
  try {
    // Create notifications for milestone streaks
    if ([3, 7, 15, 30, 60, 100].includes(streak)) {
      await createStreakMilestoneNotification(uid, streak);
    }
    
    // Check badge conditions
    await checkBadgeConditions(uid, 'STREAK_MILESTONE', { streakDays: streak });
    
  } catch (error) {
    console.error('Error checking streak milestones:', error);
  }
};

// Get all streak data for calculating current streak in component
export const getCurrentStreakFromData = (streakData) => {
  const completedDates = Object.keys(streakData)
    .filter(date => streakData[date].completed)
    .sort()
    .reverse();
  
  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);
  
  for (const dateStr of completedDates) {
    const date = new Date(dateStr);
    const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0 || daysDiff === 1) {
      streak++;
      currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Auto-mark mining completion as streak activity
export const markMiningAsStreakActivity = async (uid) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    const streakDoc = await getDoc(streakRef);
    
    let activities = ['mining_completed'];
    if (streakDoc.exists()) {
      const existingActivities = streakDoc.data().activities || [];
      activities = [...new Set([...existingActivities, 'mining_completed'])];
    }
    
    await markTodayComplete(uid, activities);
    
    return { success: true };
  } catch (error) {
    console.error('Error marking mining as streak activity:', error);
    return { success: false, error: error.message };
  }
};
