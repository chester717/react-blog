// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnl1WffsYqSsdvxIs1nXvLWW3YtHNm1xE",
  authDomain: "react-blog-b61bf.firebaseapp.com",
  projectId: "react-blog-b61bf",
  storageBucket: "react-blog-b61bf.firebasestorage.app",
  messagingSenderId: "228579294568",
  appId: "1:228579294568:web:32b9be985437610689aadd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
