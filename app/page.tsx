"use client"

import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import dynamic from "next/dynamic"
import { getUser, type User } from "@/lib/localStorage"

// Dynamically import components to prevent SSR issues
const AuthPage = dynamic(() => import("@/components/auth-page"), { ssr: false })
const Dashboard = dynamic(() => import("@/components/dashboard"), { ssr: false })

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = getUser()
    setUser(savedUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-600" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 animate-pulse text-yellow-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Loading FoodTracker
            </h2>
            <p className="text-gray-600 animate-pulse">Preparing your food management experience... 🍎✨</p>
          </div>
        </div>
      </div>
    )
  }

  return user ? <Dashboard user={user} onUserChange={setUser} /> : <AuthPage onUserChange={setUser} />
}
