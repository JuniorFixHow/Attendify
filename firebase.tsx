// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeFirestore, persistentLocalCache, persistentSingleTabManager} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_BM8yAMtUbxqIwN1PTKr_JBrbSMhvmjw",
  authDomain: "attendify-6d88b.firebaseapp.com",
  projectId: "attendify-6d88b",
  storageBucket: "attendify-6d88b.appspot.com",
  messagingSenderId: "320676341429",
  appId: "1:320676341429:web:3f4e83cf923e3f6b8500fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// initializeAuth(app);

export const db = initializeFirestore(app, {
    experimentalForceLongPolling:true,
    // localCache:persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager({})})
})

// export const auth = getAuth();