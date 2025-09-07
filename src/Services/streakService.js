import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
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
    const snapshot = await getDocs(streakRef);
    const streakData = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.date) {
        const [docYear, docMonth] = data.date.split('-');
        if (
          parseInt(docYear) === parseInt(year) &&
          parseInt(docMonth) === parseInt(month)
        ) {
          streakData[data.date] = {
            completed: data.completed,
            activities: data.activities || []
          };
        }
      }
    });

    return { success: true, streakData };
  } catch (error) {
    console.error('Error getting streak data:', error);
    return { success: false, error: error.message, streakData: {} };
  }
};

// ✅ IMPROVED: Enhanced streak calculation with better error handling
export const calculateCurrentStreak = async (uid) => {
  try {
    const streakRef = collection(db, 'users', uid, 'streakData');
    // Fetch all streak documents for the user (not filtered by month/year)
    const snapshot = await getDocs(streakRef);

    const today = new Date();
    const completedDates = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      try {
        const date = new Date(data.date);
        // ✅ Only count dates up to today (ignore future dates)
        if (data.completed && date <= today) {
          completedDates.push(data.date);
        }
      } catch (error) {
        console.error('Invalid date format:', data.date);
      }
    });

    // Sort dates in descending order
    completedDates.sort().reverse();

    let streak = 0;
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

    for (const dateStr of completedDates) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0); // Normalize to start of day

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

// ✅ NEW: Calculate longest streak in history
export const calculateLongestStreak = async (uid) => {
  try {
    const streakRef = collection(db, 'users', uid, 'streakData');
    const snapshot = await getDocs(streakRef);
    
    const today = new Date();
    const completedDates = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      try {
        const date = new Date(data.date);
        if (data.completed && date <= today) {
          completedDates.push(date);
        }
      } catch (error) {
        console.error('Invalid date format:', data.date);
      }
    });

    // Sort dates in ascending order
    completedDates.sort((a, b) => a - b);

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const daysDiff = Math.floor((completedDates[i] - completedDates[i-1]) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak || 0;
  } catch (error) {
    console.error('Error calculating longest streak:', error);
    return 0;
  }
};

// ✅ IMPROVED: Better streak milestone checking
const checkStreakMilestones = async (uid, currentStreak, previousStreak = 0) => {
  try {
    const milestones = [3, 7, 15, 30, 60, 100, 365];
    
    // Only trigger notifications for new milestones
    const newMilestones = milestones.filter(milestone => 
      currentStreak >= milestone && previousStreak < milestone
    );

    for (const milestone of newMilestones) {
      await createStreakMilestoneNotification(uid, milestone);
      console.log(`🔥 Streak milestone reached: ${milestone} days`);
    }

    // Check badge conditions with current streak
    await checkBadgeConditions(uid, 'STREAK_MILESTONE', { 
      streakDays: currentStreak,
      longestStreak: await calculateLongestStreak(uid)
    });

  } catch (error) {
    console.error('Error checking streak milestones:', error);
  }
};

// ✅ IMPROVED: Enhanced markTodayComplete with better streak tracking
export const markTodayComplete = async (uid, activities = []) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    
    // Get previous streak before updating
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const previousStreak = userSnap.data()?.stats?.currentStreak || 0;

    await setDoc(streakRef, {
      date: today,
      completed: true,
      activities: [...new Set(activities)], // Remove duplicates
      timestamp: serverTimestamp(),
      completedAt: serverTimestamp() // ✅ Track completion time
    }, { merge: true });

    // Calculate new streak
    const newStreak = await calculateCurrentStreak(uid);
    const longestStreak = await calculateLongestStreak(uid);

    // Update user stats with both current and longest streak
    await updateDoc(userRef, {
      'stats.currentStreak': newStreak,
      'stats.longestStreak': longestStreak, // ✅ Track longest streak
      'stats.totalActiveDays': increment(1), // ✅ Track total active days
      'stats.lastStreakUpdate': serverTimestamp()
    });

    // Check for milestones (only if streak increased)
    if (newStreak > previousStreak) {
      await checkStreakMilestones(uid, newStreak, previousStreak);
    }

    return { success: true, newStreak, longestStreak };
  } catch (error) {
    console.error('Error marking day complete:', error);
    return { success: false, error: error.message };
  }
};

// ✅ IMPROVED: Better mining streak activity tracking
export const markMiningAsStreakActivity = async (uid) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    const streakDoc = await getDoc(streakRef);

    let activities = ['mining_started'];

    if (streakDoc.exists()) {
      const existingActivities = streakDoc.data().activities || [];
      activities = [...new Set([...existingActivities, 'mining_started'])];
    }

    // Only mark as complete if it's the first activity today
    if (!streakDoc.exists()) {
      await markTodayComplete(uid, activities);
    } else {
      // Just update activities without affecting streak
      await updateDoc(streakRef, {
        activities: activities,
        lastMiningStart: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking mining as streak activity:', error);
    return { success: false, error: error.message };
  }
};

// ✅ IMPROVED: Enhanced mining completion tracking
export const markMiningCompletionAsStreakActivity = async (uid) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    const streakDoc = await getDoc(streakRef);

    let activities = ['mining_completed'];

    if (streakDoc.exists()) {
      const existingActivities = streakDoc.data().activities || [];
      activities = [...new Set([...existingActivities, 'mining_completed'])];
    }

    // Update or create streak entry
    await setDoc(streakRef, {
      date: today,
      completed: true, // ✅ Mining completion counts as day completed
      activities: activities,
      lastMiningCompletion: serverTimestamp(),
      timestamp: serverTimestamp()
    }, { merge: true });

    // Update streak if this is the first completion today
    if (!streakDoc.exists() || !streakDoc.data().completed) {
      const result = await markTodayComplete(uid, activities);
      return result;
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking mining completion as streak activity:', error);
    return { success: false, error: error.message };
  }
};

// ✅ NEW: Get comprehensive streak stats
export const getStreakStats = async (uid) => {
  try {
    const currentStreak = await calculateCurrentStreak(uid);
    const longestStreak = await calculateLongestStreak(uid);
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    const today = new Date().toISOString().split('T')[0];
    const streakRef = doc(db, 'users', uid, 'streakData', today);
    const todayDoc = await getDoc(streakRef);
    
    return {
      success: true,
      stats: {
        currentStreak,
        longestStreak,
        totalActiveDays: userData?.stats?.totalActiveDays || 0,
        todayCompleted: todayDoc.exists() && todayDoc.data().completed,
        todayActivities: todayDoc.exists() ? todayDoc.data().activities || [] : [],
        lastStreakUpdate: userData?.stats?.lastStreakUpdate
      }
    };
  } catch (error) {
    console.error('Error getting streak stats:', error);
    return { success: false, error: error.message };
  }
};

// ✅ IMPROVED: Better client-side streak calculation
export const getCurrentStreakFromData = (streakData) => {
  const today = new Date();
  const completedDates = Object.keys(streakData)
    .filter(date => {
      try {
        const dateObj = new Date(date);
        return streakData[date].completed && dateObj <= today;
      } catch {
        return false;
      }
    })
    .sort()
    .reverse();

  let streak = 0;
  let currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  for (const dateStr of completedDates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
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
