// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeFirestore, persistentLocalCache, persistentSingleTabManager} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_SORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// initializeAuth(app);

export const db = initializeFirestore(app, {
    experimentalForceLongPolling:true,
    // localCache:persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager({})})
})

// export const auth = getAuth();