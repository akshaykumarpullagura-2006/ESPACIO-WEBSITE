import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1ISD8zLtXM7K3XA9nVP6UCfG93g3mOAA",
  authDomain: "espacio-website-admin-portal.firebaseapp.com",
  projectId: "espacio-website-admin-portal",
  storageBucket: "espacio-website-admin-portal.firebasestorage.app",
  messagingSenderId: "946292247242",
  appId: "1:946292247242:web:a7b87df956fcdcfaad8233",
  measurementId: "G-W9NFMWGBKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Export standard Firestore helper utilities
export { collection, addDoc, getDocs, updateDoc, doc, query, orderBy };
