import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createBadgeEarnedNotification,
  createTaskCompletionNotification,
  createQuestProgressNotification  } from './notificationService';


// Badge templates - these are the initial badges every user gets
const badgeDefinitions = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first milestone',
    icon: 'FaRocket',
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/30',
    tasks: [
      { id: 1, text: "Complete profile setup", completed: false },
      { id: 2, text: "Start your first mining session", completed: false },
      { id: 3, text: "Add a profile picture", completed: false },
    ]
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain consistent activity',
    icon: 'FaFire',
    color: 'text-orange-400',
    bgGradient: 'from-orange-600/20 to-red-600/20',
    borderColor: 'border-orange-500/30',
    tasks: [
      { id: 1, text: "Login for 3 consecutive days", completed: false },
      { id: 2, text: "Mine for 5 days straight", completed: false },
      { id: 3, text: "Complete daily goals for 7 days", completed: false },
      { id: 4, text: "Maintain 10-day login streak", completed: false },
      { id: 5, text: "Achieve 15-day mining streak", completed: false },
      { id: 6, text: "Reach 30-day activity streak", completed: false },
    ]
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Build your network',
    icon: 'FaHeart',
    color: 'text-pink-400',
    bgGradient: 'from-pink-600/20 to-rose-600/20',
    borderColor: 'border-pink-500/30',
    tasks: [
      { id: 1, text: "Refer your first friend", completed: false },
      { id: 2, text: "Get 3 successful referrals", completed: false },
      { id: 3, text: "Get 5 successful referrals", completed: false },
    ]
  },
  {
    id: 'mining_expert',
    name: 'Mining Expert',
    description: 'Master the mining system',
    icon: 'FaGem',
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-violet-600/20',
    borderColor: 'border-purple-500/30',
    tasks: [
      { id: 1, text: "Complete 10 mining sessions", completed: false },
      { id: 2, text: "Mine for 100 total hours", completed: false },
      { id: 3, text: "Reach 100 coins mined", completed: false },
    ]
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Ultimate achievement',
    icon: 'FaCrown',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-600/20 to-amber-600/20',
    borderColor: 'border-yellow-500/30',
    tasks: [
      { id: 1, text: "Earn all other badges", completed: false },
      { id: 2, text: "Refer 25+ successful users", completed: false },
      { id: 3, text: "Mine 1000+ coins", completed: false },
      { id: 4, text: "Maintain 60-day streak", completed: false }
    ]
  }
];

// Initialize badges for a new user
export const initializeUserBadges = async (uid) => {
  try {
    console.log('Initializing badges for user:', uid);
    const batch = writeBatch(db);

    badgeDefinitions.forEach((badge) => {
      const badgeRef = doc(db, 'users', uid, 'badges', badge.id);
      batch.set(badgeRef, {
        badgeId: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        color: badge.color,
        bgGradient: badge.bgGradient,
        borderColor: badge.borderColor,
        tasks: badge.tasks.map(task => ({
          ...task,
          completed: false,
          completedAt: null
        })),
        progress: 0,
        isEarned: false,
        earnedAt: null
      });
    });

    await batch.commit();
    console.log('Badges initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing badges:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Check if a specific task should be completed based on user data
const checkTaskCompletion = (badgeId, taskId, userData) => {
  const stats = userData.stats || {};
  const mining = userData.mining || {};
  const social = userData.social || {};
  const profile = userData.profile || {};

  switch (badgeId) {
    case 'first_steps':
      switch (taskId) {
        case 1: // Complete profile setup
          return profile.username && profile.email;
        case 2: // Start first mining session
          return mining.totalMiningSessions >= 1;
        case 3: // Add profile picture
          return profile.avatar || profile.profilePicture;
        default:
          return false;
      }

    case 'streak_master':
      const currentStreak = stats.currentStreak || 0;
      switch (taskId) {
        case 1: // Login for 3 consecutive days
          return currentStreak >= 3;
        case 2: // Mine for 5 days straight
          return currentStreak >= 5;
        case 3: // Complete daily goals for 7 days
          return currentStreak >= 7;
        case 4: // Maintain 10-day login streak
          return currentStreak >= 10;
        case 5: // Achieve 15-day mining streak
          return currentStreak >= 15;
        case 6: // Reach 30-day activity streak
          return currentStreak >= 30;
        default:
          return false;
      }

    case 'social_butterfly':
      const totalReferrals = social.referredUsers?.length || 0;
      switch (taskId) {
        case 1: // Refer first friend
          return totalReferrals >= 1;
        case 2: // Get 3 successful referrals
          return totalReferrals >= 3;
        case 3: // Get 5 successful referrals
          return totalReferrals >= 5;
        default:
          return false;
      }

    case 'mining_expert':
      const totalSessions = mining.totalMiningSessions || 0;
      const totalCoins = stats.totalCoinsEarned || 0;
      // Calculate total hours (assuming each session is max 24 hours)
      const totalHours = totalSessions * 24; // Simplified calculation
      
      switch (taskId) {
        case 1: // Complete 10 mining sessions
          return totalSessions >= 10;
        case 2: // Mine for 100 total hours
          return totalHours >= 100;
        case 3: // Reach 100 coins mined
          return totalCoins >= 100;
        default:
          return false;
      }

    case 'legend':
      const legendTotalReferrals = social.referredUsers?.length || 0;
      const legendTotalCoins = stats.totalCoinsEarned || 0;
      const legendStreak = stats.currentStreak || 0;
      
      switch (taskId) {
        case 1: // Earn all other badges
          // This would need to check if all other badges are earned
          return false; // Implement this logic separately
        case 2: // Refer 25+ successful users
          return legendTotalReferrals >= 25;
        case 3: // Mine 1000+ coins
          return legendTotalCoins >= 1000;
        case 4: // Maintain 60-day streak
          return legendStreak >= 60;
        default:
          return false;
      }

    default:
      return false;
  }
};

// ✅ Validate quest completion based on actual user data
export const validateAndUpdateBadgeProgress = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    const badges = await getUserBadges(uid);
    if (!badges.success) return badges;

    for (const badge of badges.badges) {
      if (badge.isEarned) continue;

      let hasUpdates = false;
      let newTasksCompleted = []; // Track newly completed tasks
      
      const updatedTasks = badge.tasks.map(task => {
        const shouldBeCompleted = checkTaskCompletion(badge.badgeId, task.id, userData);
        
        if (shouldBeCompleted && !task.completed) {
          hasUpdates = true;
          newTasksCompleted.push(task.text); // Add to newly completed
          return {
            ...task,
            completed: true,
            completedAt: new Date()
          };
        }
        return task;
      });

      if (hasUpdates) {
        const completedTasksCount = updatedTasks.filter(task => task.completed).length;
        const progress = (completedTasksCount / updatedTasks.length) * 100;
        const isEarned = progress === 100;

        const badgeRef = doc(db, 'users', uid, 'badges', badge.badgeId);
        await updateDoc(badgeRef, {
          tasks: updatedTasks,
          progress,
          isEarned,
          ...(isEarned && !badge.isEarned ? { earnedAt: new Date() } : {})
        });

        // 🔥 CREATE NOTIFICATIONS FOR NEW COMPLETIONS
        for (const taskName of newTasksCompleted) {
          await createTaskCompletionNotification(uid, taskName, badge.name);
        }

        // Progress milestone notifications (25%, 50%, 75%)
        if (!isEarned && progress >= 25 && progress % 25 === 0) {
          await createQuestProgressNotification(uid, badge.name, Math.round(progress));
        }

        // Badge completion notification
        if (isEarned && !badge.isEarned) {
          await createBadgeEarnedNotification(uid, badge.name);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error validating badge progress:', error);
    return { success: false, error: error.message };
  }
};
// ✅ KEEP: Legacy function for backward compatibility (called by other services)
export const checkBadgeConditions = async (uid, action, metadata = {}) => {
  try {
    // Instead of manually updating specific badges, just validate all badges
    await validateAndUpdateBadgeProgress(uid);
    return { success: true };
  } catch (error) {
    console.error('Error checking badge conditions:', error);
    return { success: false, error: error.message };
  }
};

// Get all badges for a user
export const getUserBadges = async (uid) => {
  try {
    const badgesRef = collection(db, 'users', uid, 'badges');
    // Remove query and orderBy, just get all docs
    const snapshot = await getDocs(badgesRef);
    
    // Sort in JS
    const badges = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => (a.badgeId > b.badgeId ? 1 : -1));

    return { success: true, badges };
  } catch (error) {
    console.error('Error getting user badges:', error);
    return { success: false, error: error.message, badges: [] };
  }
};

// Subscribe to real-time badge updates
export const subscribeToBadges = (uid, callback) => {
  const badgesRef = collection(db, 'users', uid, 'badges');
  // Remove query and orderBy, just use collection ref
  return onSnapshot(badgesRef, (snapshot) => {
    const badges = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => (a.badgeId > b.badgeId ? 1 : -1));
    callback(badges);
  });
};

// Subscribe to real-time badge updates for carousel (with auto-validation)
export const subscribeToBadgeQuests = (uid, callback) => {
  const badgesRef = collection(db, 'users', uid, 'badges');
  // Remove query and orderBy, just use collection ref
  return onSnapshot(badgesRef, async (snapshot) => {
    await validateAndUpdateBadgeProgress(uid);
    const badges = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          badgeId: data.badgeId,
          name: data.name,
          description: data.description,
          icon: data.icon,
          color: data.color,
          bgGradient: data.bgGradient,
          borderColor: data.borderColor,
          tasks: data.tasks || [],
          isEarned: data.isEarned || false,
          progress: data.progress || 0
        };
      })
      .sort((a, b) => (a.badgeId > b.badgeId ? 1 : -1));
    callback(badges);
  });
};

// ✅ KEEP: For backward compatibility (used by BadgeQuests component)
export const updateBadgeTask = async (uid, badgeId, taskId, completed = true) => {
  // This function now just triggers validation instead of manual updates
  await validateAndUpdateBadgeProgress(uid);
  return { success: true, badgeEarned: false, progress: 0 };
};

// Export the badge definitions for use elsewhere
export { badgeDefinitions };
