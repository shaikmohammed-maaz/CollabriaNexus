import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Subscribe to user's recent activities
export const subscribeToUserActivities = (uid, callback) => {
  const activitiesRef = collection(db, 'users', uid, 'activities');
  const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(10));
  
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(activities);
  });
};

// Add a new activity
export const addUserActivity = async (uid, activityData) => {
  try {
    const activitiesRef = collection(db, 'users', uid, 'activities');
    await addDoc(activitiesRef, {
      activity: activityData.activity,
      time: activityData.time || 'Just now',
      icon: activityData.icon,
      color: activityData.color,
      timestamp: serverTimestamp(),
      metadata: activityData.metadata || {}
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding activity:', error);
    return { success: false, error: error.message };
  }
};
