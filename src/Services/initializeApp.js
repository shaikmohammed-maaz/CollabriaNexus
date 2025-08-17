import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const initializeAppConfig = async () => {
  const configRef = doc(db, 'appConfig', 'main');
  await setDoc(configRef, {
    miningRate: 3.0,
    dailyReward: 3,
    coinToUSDRate: 0.12,
    tierLevels: {
      'Bronze Miner': { min: 0, max: 100 },
      'Silver Miner': { min: 100, max: 500 },
      'Gold Miner': { min: 500, max: 1000 },
      'Diamond Miner': { min: 1000, max: 5000 }
    },
    appVersion: '1.0.0',
    maintenanceMode: false
  });
};
