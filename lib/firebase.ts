import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCqsvnovk9lSRbBX_BkqC_VVxfK9meS3hg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "food-tracker-app-3a7e9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "food-tracker-app-3a7e9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "food-tracker-app-3a7e9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "286456176380",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:286456176380:web:4635524462be180d5dc179",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6KJSM0JCEM",
}

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Only initialize auth and firestore on client side
let auth: any = null
let db: any = null

if (typeof window !== "undefined") {
  auth = getAuth(app)
  db = getFirestore(app)
}

export { auth, db }
