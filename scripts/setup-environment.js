// Environment Variables Setup for Your Firebase Project
console.log("🔥 Firebase Environment Variables Setup")
console.log("=====================================")
console.log("")
console.log("Add these environment variables to your deployment platform:")
console.log("")
console.log("NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCqsvnovk9lSRbBX_BkqC_VVxfK9meS3hg")
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=food-tracker-app-3a7e9.firebaseapp.com")
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID=food-tracker-app-3a7e9")
console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=food-tracker-app-3a7e9.firebasestorage.app")
console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=286456176380")
console.log("NEXT_PUBLIC_FIREBASE_APP_ID=1:286456176380:web:4635524462be180d5dc179")
console.log("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KJSM0JCEM")
console.log("")
console.log("📋 For Vercel deployment:")
console.log("1. Go to your project dashboard")
console.log("2. Navigate to Settings > Environment Variables")
console.log("3. Add each variable above")
console.log("4. Redeploy your application")
console.log("")
console.log("🔐 Firebase Security Setup:")
console.log("1. Go to Firebase Console > Authentication")
console.log("2. Enable Email/Password sign-in method")
console.log("3. Go to Firestore Database")
console.log("4. Create database in production mode")
console.log("5. Update security rules (see below)")
console.log("")
console.log("🛡️ Firestore Security Rules:")
console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own food items
    match /foods/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
`)
console.log("")
console.log("✅ Your Firebase project is ready!")
console.log("Project ID: food-tracker-app-3a7e9")
console.log("Auth Domain: food-tracker-app-3a7e9.firebaseapp.com")
