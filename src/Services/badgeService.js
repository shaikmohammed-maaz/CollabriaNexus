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
import { createBadgeEarnedNotification } from './notificationService';

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
      { id: 1, text: "Complete profile setup", completed: true },
      { id: 2, text: "Start your first mining session", completed: false },
      { id: 3, text: "Join the community", completed: false },
      { id: 4, text: "Share your referral code", completed: false },
      { id: 5, text: "Complete first goal", completed: false },
      { id: 6, text: "Add a profile picture", completed: false },
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
      { id: 3, text: "Connect with 5 friends", completed: false },
      { id: 4, text: "Share achievement on social media", completed: false },
      { id: 5, text: "Join a team challenge", completed: false },
      { id: 6, text: "Help a friend reach their goal", completed: false },
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
      { id: 3, text: "Achieve optimal mining efficiency", completed: false },
      { id: 4, text: "Discover rare mining bonus", completed: false },
      { id: 5, text: "Reach 1000 coins mined", completed: false },
      { id: 6, text: "Unlock advanced mining tools", completed: false },
    ]
  },
  {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Achieve ambitious targets',
    icon: 'FaCog',
    color: 'text-green-400',
    bgGradient: 'from-green-600/20 to-emerald-600/20',
    borderColor: 'border-green-500/30',
    tasks: [
      { id: 1, text: "Set your first goal", completed: false },
      { id: 2, text: "Complete 10 goals", completed: false },
      { id: 3, text: "Achieve perfect day (100% goals)", completed: false },
      { id: 4, text: "Complete 50 goals total", completed: false },
      { id: 5, text: "Maintain 7-day goal streak", completed: false },
      { id: 6, text: "Reach 100 goals milestone", completed: false },
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
      { id: 2, text: "Reach top 10 leaderboard", completed: false },
      { id: 3, text: "Refer 25+ successful users", completed: false },
      { id: 4, text: "Mine 10,000+ coins", completed: false },
      { id: 5, text: "Maintain 60-day streak", completed: false },
      { id: 6, text: "Complete 500 goals", completed: false },
    ]
  }
];

// Initialize badges for a new user - THIS WAS MISSING!
export const initializeUserBadges = async (uid) => {
  try {
    console.log('Initializing badges for user:', uid);
    
    // Use batch write for efficiency
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
          completed: task.completed || false,
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

// Get all badges for a user
export const getUserBadges = async (uid) => {
  try {
    const badgesRef = collection(db, 'users', uid, 'badges');
    const q = query(badgesRef, orderBy('badgeId'));
    const snapshot = await getDocs(q);
    
    const badges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, badges };
  } catch (error) {
    console.error('Error getting user badges:', error);
    return { success: false, error: error.message, badges: [] };
  }
};

// Subscribe to real-time badge updates
export const subscribeToBadges = (uid, callback) => {
  const badgesRef = collection(db, 'users', uid, 'badges');
  const q = query(badgesRef, orderBy('badgeId'));
  
  return onSnapshot(q, (snapshot) => {
    const badges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(badges);
  });
};

// Update badge progress
export const updateBadgeProgress = async (uid, badgeId, taskId, completed = true) => {
  try {
    const badgeRef = doc(db, 'users', uid, 'badges', badgeId);
    const badgeDoc = await getDoc(badgeRef);
    
    if (!badgeDoc.exists()) {
      return { success: false, error: 'Badge not found' };
    }
    
    const badgeData = badgeDoc.data();
    const updatedTasks = badgeData.tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed, completedAt: completed ? new Date() : null }
        : task
    );
    
    const completedTasksCount = updatedTasks.filter(task => task.completed).length;
    const progress = (completedTasksCount / updatedTasks.length) * 100;
    const isEarned = progress === 100;
    
    const updateData = {
      tasks: updatedTasks,
      progress,
      isEarned,
      ...(isEarned && !badgeData.isEarned ? { earnedAt: new Date() } : {})
    };
    
    await updateDoc(badgeRef, updateData);
    
    // Create notification if badge was just earned
    if (isEarned && !badgeData.isEarned) {
      await createBadgeEarnedNotification(uid, badgeData.name);
    }
    
    return { 
      success: true, 
      badgeEarned: isEarned && !badgeData.isEarned,
      progress 
    };
  } catch (error) {
    console.error('Error updating badge progress:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to check and update multiple badges based on user actions
export const checkBadgeConditions = async (uid, action, metadata = {}) => {
  try {
    const badges = await getUserBadges(uid);
    if (!badges.success) return;
    
    for (const badge of badges.badges) {
      if (badge.isEarned) continue; // Skip already earned badges
      
      // Check different badge conditions
      switch (action) {
        case 'FIRST_LOGIN':
          if (badge.badgeId === 'first_steps') {
            await updateBadgeProgress(uid, badge.badgeId, 1, true); // Complete profile setup task
          }
          break;
          
        case 'MINING_STARTED':
          if (badge.badgeId === 'first_steps') {
            await updateBadgeProgress(uid, badge.badgeId, 2, true); // Start first mining session
          }
          if (badge.badgeId === 'mining_expert') {
            const totalSessions = metadata.totalSessions || 0;
            if (totalSessions >= 1) {
              await updateBadgeProgress(uid, badge.badgeId, 1, true); // Complete 10 mining sessions
            }
          }
          break;
          
        case 'MINING_COMPLETED':
          if (badge.badgeId === 'mining_expert') {
            const totalSessions = metadata.totalSessions || 0;
            if (totalSessions >= 10) {
              await updateBadgeProgress(uid, badge.badgeId, 1, true); // Complete 10 mining sessions
            }
          }
          break;
          
        case 'REFERRAL_SUCCESS':
          if (badge.badgeId === 'social_butterfly') {
            const totalReferrals = metadata.totalReferrals || 0;
            if (totalReferrals >= 1) {
              await updateBadgeProgress(uid, badge.badgeId, 1, true); // Refer first friend
            }
            if (totalReferrals >= 3) {
              await updateBadgeProgress(uid, badge.badgeId, 2, true); // Get 3 successful referrals
            }
          }
          break;
          
        case 'STREAK_MILESTONE':
          if (badge.badgeId === 'streak_master') {
            const streakDays = metadata.streakDays || 0;
            if (streakDays >= 3) {
              await updateBadgeProgress(uid, badge.badgeId, 1, true); // Login for 3 consecutive days
            }
            if (streakDays >= 7) {
              await updateBadgeProgress(uid, badge.badgeId, 3, true); // Complete daily goals for 7 days
            }
          }
          break;
          
        default:
          break;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error checking badge conditions:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time badge updates for carousel
export const subscribeToBadgeQuests = (uid, callback) => {
  const badgesRef = collection(db, 'users', uid, 'badges');
  const q = query(badgesRef, orderBy('badgeId'));
  
  return onSnapshot(q, (snapshot) => {
    const badges = snapshot.docs.map(doc => {
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
    });
    callback(badges);
  });
};

// Update specific task in a badge
export const updateBadgeTask = async (uid, badgeId, taskId, completed = true) => {
  try {
    const badgeRef = doc(db, 'users', uid, 'badges', badgeId);
    const badgeDoc = await getDoc(badgeRef);
    
    if (!badgeDoc.exists()) {
      return { success: false, error: 'Badge not found' };
    }
    
    const badgeData = badgeDoc.data();
    const updatedTasks = badgeData.tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed, completedAt: completed ? new Date() : null }
        : task
    );
    
    const completedTasksCount = updatedTasks.filter(task => task.completed).length;
    const progress = (completedTasksCount / updatedTasks.length) * 100;
    const isEarned = progress === 100;
    
    const updateData = {
      tasks: updatedTasks,
      progress,
      isEarned,
      ...(isEarned && !badgeData.isEarned ? { earnedAt: new Date() } : {})
    };
    
    await updateDoc(badgeRef, updateData);
    
    // Create notification if badge was just earned
    if (isEarned && !badgeData.isEarned) {
      await createBadgeEarnedNotification(uid, badgeData.name);
    }
    
    return { 
      success: true, 
      badgeEarned: isEarned && !badgeData.isEarned,
      progress 
    };
  } catch (error) {
    console.error('Error updating badge task:', error);
    return { success: false, error: error.message };
  }
};

// Export the badge definitions for use elsewhere
export { badgeDefinitions };
