
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmR2MsA_-WjaIrTAwewmLtklF7E3XeB6Y",
  authDomain: "chess-2b032.firebaseapp.com",
  projectId: "chess-2b032",
  storageBucket: "chess-2b032.firebasestorage.app",
  messagingSenderId: "546160040274",
  appId: "1:546160040274:web:d8ab52c4e6c951e99ac28b",
  measurementId: "G-6XKGF9JJ6W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


