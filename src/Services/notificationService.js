import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Subscribe to real-time notifications
export const subscribeToNotifications = (uid, callback) => {
  const notificationsRef = collection(db, 'users', uid, 'notifications');
  // Remove query, where, and orderBy
  return onSnapshot(notificationsRef, (snapshot) => {
    // Filter and sort in JS
    const notifications = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(n => !n.isDismissed)
      .sort((a, b) => {
        // Sort by timestamp descending
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.seconds - a.timestamp.seconds;
      });
    callback(notifications);
  });
};

// Create a new notification
export const createNotification = async (uid, notificationData) => {
  try {
    const notificationsRef = collection(db, 'users', uid, 'notifications');
    await addDoc(notificationsRef, {
      message: notificationData.message,
      type: notificationData.type || 'general',
      timestamp: serverTimestamp(),
      isRead: false,
      isDismissed: false,
      metadata: notificationData.metadata || {}
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (uid, notificationId) => {
  try {
    const notificationRef = doc(db, 'users', uid, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
};

// Dismiss notification
export const dismissNotification = async (uid, notificationId) => {
  try {
    const notificationRef = doc(db, 'users', uid, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isDismissed: true
    });
    return { success: true };
  } catch (error) {
    console.error('Error dismissing notification:', error);
    return { success: false, error: error.message };
  }
};

// Helper functions for specific notification types
export const createMiningCompletionNotification = async (uid, coinsEarned) => {
  return await createNotification(uid, {
    message: `🎉 Mining completed! You earned ${coinsEarned} coins!`,
    type: 'mining_completed',
    metadata: { coinsEarned }
  });
};

export const createReferralNotification = async (uid, referredUsername) => {
  return await createNotification(uid, {
    message: `🤝 ${referredUsername} joined using your referral code! Mining rate boosted!`,
    type: 'referral_success',
    metadata: { referredUsername }
  });
};

export const createBadgeEarnedNotification = async (uid, badgeName) => {
  return await createNotification(uid, {
    message: `🏆 Congratulations! You earned the "${badgeName}" badge!`,
    type: 'badge_earned',
    metadata: { badgeName }
  });
};

// Add this function
export const createStreakMilestoneNotification = async (uid, streakCount) => {
  return await createNotification(uid, {
    message: `🔥 Amazing! You've reached a ${streakCount}-day streak!`,
    type: 'streak_milestone',
    metadata: { streakCount }
  });
};

export const createWelcomeBonusNotification = async (uid) => {
  return await createNotification(uid, {
    message: `🎁 Welcome! You received a mining rate bonus for joining via referral!`,
    type: 'welcome_bonus'
  });
};

export const createPokeNotification = async (uid, fromUserName) => {
  return await createNotification(uid, {
    message: `👋 ${fromUserName} poked you! Time to start mining! ⛏️`,
    type: 'poke_notification',
    metadata: { fromUserName }
  });
};


// Task completion notification
export const createTaskCompletionNotification = async (uid, taskName, badgeName) => {
  return await createNotification(uid, {
    message: `✅ Task completed: "${taskName}" in ${badgeName} badge!`,
    type: 'task_completed',
    metadata: { taskName, badgeName }
  });
};

// Quest progress notification
export const createQuestProgressNotification = async (uid, badgeName, progress) => {
  return await createNotification(uid, {
    message: `🎯 ${progress}% progress on "${badgeName}" badge!`,
    type: 'quest_progress', 
    metadata: { badgeName, progress }
  });
};
