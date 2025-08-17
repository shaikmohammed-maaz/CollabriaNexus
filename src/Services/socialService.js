import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createNotification } from './notificationService';

// Get list of friends for a user
export const getFriendsList = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: true, friends: [] };
    }
    
    const userData = userSnap.data();
    const friendsUids = userData.social?.friends || [];
    
    if (friendsUids.length === 0) {
      return { success: true, friends: [] };
    }
    
    const friends = [];
    
    // Get details for each friend
    for (const friendUid of friendsUids) {
      const friendDoc = await getDoc(doc(db, 'users', friendUid));
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        friends.push({
          id: friendUid,
          name: friendData.profile?.username || 'Unknown',
          avatar: friendData.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${friendData.profile?.username}`,
          mining: friendData.mining?.isMining || false,
          lastActive: friendData.profile?.lastActive ? 
            getTimeAgo(friendData.profile.lastActive.toDate()) : 'Unknown',
          joined: friendData.profile?.joined ? 
            friendData.profile.joined.toDate().toLocaleDateString() : 'Unknown',
          coinsEarned: friendData.stats?.totalCoinsEarned || 0,
          level: friendData.stats?.level || 1,
          streak: friendData.stats?.currentStreak || 0,
          isVip: friendData.stats?.isVip || false
        });
      }
    }
    
    return { success: true, friends };
  } catch (error) {
    console.error('Error getting friends list:', error);
    return { success: false, error: error.message, friends: [] };
  }
};

// Get users who were referred by this user
export const getReferredFriends = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: true, friends: [] };
    }
    
    const userData = userSnap.data();
    const referredUserIds = userData.social?.referredUsers || [];
    
    if (referredUserIds.length === 0) {
      return { success: true, friends: [] };
    }
    
    const friends = [];
    
    // Get details for each referred user
    for (const referredId of referredUserIds) {
      const referredDoc = await getDoc(doc(db, 'users', referredId));
      if (referredDoc.exists()) {
        const referredData = referredDoc.data();
        friends.push({
          id: referredId,
          name: referredData.profile?.username || 'Unknown',
          avatar: referredData.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${referredData.profile?.username}`,
          mining: referredData.mining?.isMining || false,
          lastActive: referredData.profile?.lastActive ? 
            getTimeAgo(referredData.profile.lastActive.toDate()) : 'Unknown',
          joined: referredData.profile?.joined ? 
            referredData.profile.joined.toDate().toLocaleDateString() : 'Unknown',
          coinsEarned: referredData.stats?.totalCoinsEarned || 0,
          level: referredData.stats?.level || 1,
          streak: referredData.stats?.currentStreak || 0,
          isVip: referredData.stats?.isVip || false
        });
      }
    }
    
    return { success: true, friends };
  } catch (error) {
    console.error('Error getting referred friends:', error);
    return { success: false, error: error.message, friends: [] };
  }
};

// Get network statistics
export const getNetworkStats = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const referredUserIds = userData.social?.referredUsers || [];
    
    let totalNetworkCoins = 0;
    let activeNow = 0;
    let vipMembers = 0;
    
    // Calculate stats from referred users
    for (const referredId of referredUserIds) {
      const referredDoc = await getDoc(doc(db, 'users', referredId));
      if (referredDoc.exists()) {
        const referredData = referredDoc.data();
        totalNetworkCoins += referredData.stats?.totalCoinsEarned || 0;
        
        if (referredData.mining?.isMining) {
          activeNow++;
        }
        
        if (referredData.stats?.isVip) {
          vipMembers++;
        }
      }
    }
    
    return {
      success: true,
      stats: {
        totalFriends: referredUserIds.length,
        activeNow,
        networkCoins: totalNetworkCoins,
        vipMembers,
        referralCode: userData.profile?.referralCode || ''
      }
    };
  } catch (error) {
    console.error('Error getting network stats:', error);
    return { success: false, error: error.message };
  }
};

// Send poke notification to a friend
export const pokeFriend = async (fromUid, toUid, friendName) => {
  try {
    // TODO: Implement poke functionality
    // This should:
    // 1. Create a notification for the friend
    // 2. Maybe add some animation or visual feedback
    // 3. Track poke analytics if needed
    
    await createNotification(toUid, {
      message: `👋 You got a poke from a friend! Time to start mining! ⛏️`,
      type: 'poke_notification',
      metadata: { fromUid, friendName }
    });
    
    return { success: true, message: `Poked ${friendName}! They'll get a notification.` };
  } catch (error) {
    console.error('Error poking friend:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};
