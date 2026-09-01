import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClVOf3xNsERVZVuPkn58CWstbJAGQmpiM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "boreo-79678.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "boreo-79678",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "boreo-79678.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "52790019087",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:52790019087:web:9230d492aa311101becf7a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FFCSWF1GP2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => console.log("Analytics not supported:", err));

export default app;
