import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmoW36ryce7BSXWzMDX8OAuOMou1rlm9E",
  authDomain: "event-management-2c6b4.firebaseapp.com",
  projectId: "event-management-2c6b4",
  storageBucket: "event-management-2c6b4.firebasestorage.app",
  messagingSenderId: "706437240442",
  appId: "1:706437240442:web:d926f4e523c165ca4b8dc3"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
