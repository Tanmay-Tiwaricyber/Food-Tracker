// Firebase Setup Instructions
console.log("🔥 Firebase Setup Instructions")
console.log("================================")
console.log("")
console.log("1. Go to https://console.firebase.google.com/")
console.log("2. Create a new project or select existing one")
console.log("3. Enable Authentication:")
console.log("   - Go to Authentication > Sign-in method")
console.log("   - Enable Email/Password authentication")
console.log("")
console.log("4. Create Firestore Database:")
console.log("   - Go to Firestore Database")
console.log("   - Create database in production mode")
console.log("   - Choose your preferred location")
console.log("")
console.log("5. Set up Firestore Security Rules:")
console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /foods/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
`)
console.log("")
console.log("6. Get your Firebase config:")
console.log("   - Go to Project Settings > General")
console.log("   - Scroll down to 'Your apps'")
console.log("   - Click on Web app or create one")
console.log("   - Copy the config object")
console.log("")
console.log("7. Add environment variables:")
console.log("   Create a .env.local file with:")
console.log("   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key")
console.log("   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain")
console.log("   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id")
console.log("   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket")
console.log("   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id")
console.log("   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id")
console.log("")
console.log("8. For Gemini AI integration:")
console.log("   - Get API key from https://ai.google.dev/")
console.log("   - Add GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key to .env.local")
console.log("")
console.log("✅ Setup complete! Your food tracker app is ready to use!")
