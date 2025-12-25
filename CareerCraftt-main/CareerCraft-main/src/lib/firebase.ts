
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBR-SgRl86AerwZMtloH_4HH0TFW9xAEfs",
  authDomain: "careercraft-bc8d9.firebaseapp.com",
  projectId: "careercraft-bc8d9",
  storageBucket: "careercraft-bc8d9.firebasestorage.app",
  messagingSenderId: "728133810972",
  appId: "1:728133810972:web:0d88ffb3eb7a3f6380d8d9",
  measurementId: "G-GV6NX3MXQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
