// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmoW36ryce7BSXWzMDX8OAuOMou1rlm9E",
  authDomain: "event-management-2c6b4.firebaseapp.com",
  projectId: "event-management-2c6b4",
  storageBucket: "event-management-2c6b4.firebasestorage.app",
  messagingSenderId: "706437240442",
  appId: "1:706437240442:web:d926f4e523c165ca4b8dc3",
  measurementId: "G-GDZ3K6VQJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
