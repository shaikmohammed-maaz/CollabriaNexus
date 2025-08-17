import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createReferralNotification, createWelcomeBonusNotification } from './notificationService';
import { checkBadgeConditions } from './badgeService';
import { initializeUserBadges } from './badgeService';


// Generate unique referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Process referral when new user signs up with a referral code
const processReferral = async (referralCode, newUserUid) => {
  try {
    console.log(`Processing referral: ${referralCode} for new user: ${newUserUid}`);
    
    // Query to find the user who owns this referral code
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('profile.referralCode', '==', referralCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Referral code not found:', referralCode);
      return { success: false, error: 'Invalid referral code' };
    }
    
    // Get the referrer's document
    const referrerDoc = querySnapshot.docs[0];
    const referrerUid = referrerDoc.id;
    const referrerData = referrerDoc.data();
    
    // Get new user data for username
    const newUserRef = doc(db, 'users', newUserUid);
    const newUserSnap = await getDoc(newUserRef);
    const newUserData = newUserSnap.data();
    
    console.log('Found referrer:', referrerUid);
    
    // Update referrer's stats
    const referrerRef = doc(db, 'users', referrerUid);
    await updateDoc(referrerRef, {
      'social.totalReferrals': increment(1),
      'social.referredUsers': arrayUnion(newUserUid),
      'mining.miningRate': (referrerData.mining?.miningRate || 3.0) + 0.1,
      'profile.lastActive': serverTimestamp()
    });
    
    // CREATE NOTIFICATIONS
    await createReferralNotification(referrerUid, newUserData.profile.username);
    await createWelcomeBonusNotification(newUserUid);
    
    // Update new user to show who referred them
    await updateDoc(newUserRef, {
      'profile.referredBy': referrerUid,
      'mining.miningRate': 3.2
    });
    
    // FIXED: Get the current total referrals for badge checking
    const currentTotalReferrals = (referrerData.social?.totalReferrals || 0) + 1;
    
    // Check badge conditions for referral success
    await checkBadgeConditions(referrerUid, 'REFERRAL_SUCCESS', { 
      totalReferrals: currentTotalReferrals  // FIXED: Use the correct variable
    });
    
    console.log('Referral processed successfully');
    return { 
      success: true, 
      referrerUid,
      message: 'Referral processed successfully! Both users received bonuses.' 
    };
    
  } catch (error) {
    console.error('Error processing referral:', error);
    return { success: false, error: error.message };
  }
};



// Get list of users referred by a specific user
export const getReferredUsers = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const referredUserIds = userData.social?.referredUsers || [];
    
    if (referredUserIds.length === 0) {
      return { success: true, referredUsers: [] };
    }
    
    // Get details of all referred users
    const referredUsers = [];
    for (const referredId of referredUserIds) {
      const referredUserRef = doc(db, 'users', referredId);
      const referredUserSnap = await getDoc(referredUserRef);
      
      if (referredUserSnap.exists()) {
        const referredUserData = referredUserSnap.data();
        referredUsers.push({
          uid: referredId,
          username: referredUserData.profile?.username || 'Unknown',
          joinedDate: referredUserData.profile?.joined,
          coinsEarned: referredUserData.stats?.totalCoinsEarned || 0,
          isActive: referredUserData.mining?.isMining || false
        });
      }
    }
    
    return { success: true, referredUsers };
  } catch (error) {
    console.error('Error getting referred users:', error);
    return { success: false, error: error.message };
  }
};

// Get referral stats for a user
export const getReferralStats = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const referredUsers = userData.social?.referredUsers || [];
    
    // Calculate total coins earned by referred users
    let totalNetworkCoins = 0;
    let activeReferrals = 0;
    
    for (const referredId of referredUsers) {
      const referredUserRef = doc(db, 'users', referredId);
      const referredUserSnap = await getDoc(referredUserRef);
      
      if (referredUserSnap.exists()) {
        const referredData = referredUserSnap.data();
        totalNetworkCoins += referredData.stats?.totalCoinsEarned || 0;
        if (referredData.mining?.isMining) {
          activeReferrals++;
        }
      }
    }
    
    // Update user's network coins
    await updateDoc(userRef, {
      'social.networkCoins': totalNetworkCoins
    });
    
    return {
      success: true,
      stats: {
        totalReferrals: referredUsers.length,
        activeReferrals,
        totalNetworkCoins,
        currentMiningRateBoost: (referredUsers.length * 0.1).toFixed(1),
        referralCode: userData.profile?.referralCode
      }
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return { success: false, error: error.message };
  }
};

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const newUser = {
      uid,
      profile: {
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        avatar: '',
        joined: serverTimestamp(),
        lastActive: serverTimestamp(),
        referralCode: generateReferralCode(), // Generate unique referral code
        referredBy: userData.referralCode ? null : null // Will be set by processReferral
      },
      stats: {
        coinsEarned: 0,
        totalCoinsEarned: 0,
        level: 1,
        currentTier: 'Bronze Miner',
        nextTier: 'Silver Miner',
        tierProgress: 0,
        currentStreak: 0,
        totalMined: 0,
        rank: '#0',
        isVip: false
      },
      mining: {
        isMining: false,
        lastMiningStart: null,
        coinsMined: 0,
        nextAvailable: null,
        totalMiningSessions: 0,
        miningRate: 3.0 // Default rate, will be boosted if referred
      },
      social: {
        friends: [],
        totalReferrals: 0,
        referredUsers: [], // Array to store UIDs of users this user referred
        networkCoins: 0
      },
      settings: {
        notifications: true,
        privacy: 'public'
      }
    };

    await setDoc(userRef, newUser);
    
    // Initialize user badges
    await initializeUserBadges(uid);
    
    // Process referral if provided
    if (userData.referralCode) {
      const referralResult = await processReferral(userData.referralCode, uid);
      if (referralResult.success) {
        console.log('Referral processed during user creation');
      } else {
        console.log('Referral processing failed:', referralResult.error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Rest of your existing functions...
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserStats = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateLastActive = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      'profile.lastActive': serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last active:', error);
  }
};
