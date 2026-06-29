// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSLzfxDAfzLN_S7J9RE6R16e-vuc0Jyds",
  authDomain: "driveprepplus.firebaseapp.com",
  projectId: "driveprepplus",
  storageBucket: "driveprepplus.firebasestorage.app",
  messagingSenderId: "312359707279",
  appId: "1:312359707279:web:3393799438b31e323c86fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();