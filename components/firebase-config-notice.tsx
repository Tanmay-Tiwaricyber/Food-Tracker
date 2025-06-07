"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FirebaseConfigNotice() {
  const isConfigured =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-key"

  if (isConfigured) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-2xl border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-6 w-6" />
            <span>Firebase Configuration Required 🔥</span>
          </CardTitle>
          <CardDescription>Your Firebase project needs to be configured to use this app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The app is currently running with demo configuration. Please set up your Firebase project to enable full
              functionality.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold">Quick Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Firebase Console <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Create a new project or select existing one</li>
              <li>Enable Authentication (Email/Password)</li>
              <li>Create Firestore Database</li>
              <li>Get your web app config</li>
              <li>Add environment variables to your deployment</li>
            </ol>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Required Environment Variables:</h4>
            <code className="text-xs block space-y-1">
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</div>
              <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket</div>
              <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</div>
              <div>NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id</div>
            </code>
          </div>

          <Button asChild className="w-full">
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
              Set Up Firebase Project 🚀
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
