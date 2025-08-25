// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

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

// Initialize Auth and Google Provider only on the client side
let auth, googleProvider;
if (typeof window !== "undefined") {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Set persistence to session (or local if you want to persist even after browser close)
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Auth state persistence is now enabled
    })
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
}

export { auth, googleProvider };
