// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQt0roNa3ToGil0qkUq0kdOElLhNnLv7c",
  authDomain: "cv-store-67533.firebaseapp.com",
  projectId: "cv-store-67533",
  storageBucket: "cv-store-67533.appspot.com",
  messagingSenderId: "459271233637",
  appId: "1:459271233637:web:8bb6d69e1e548f34aee68c",
  measurementId: "G-MVC72BWGCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services only on the client side
let auth, googleProvider, db;

if (typeof window !== "undefined") {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app); // Initialize Firestore

  // Set persistence to session
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Auth state persistence is now enabled
    })
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
}

export { auth, googleProvider, db };
