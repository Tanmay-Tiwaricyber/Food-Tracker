"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Apple,
  Utensils,
  Brain,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react"
import AddFoodDialog from "@/components/add-food-dialog"
import FoodList from "@/components/food-list"
import AIFeatures from "@/components/ai-features"
import type { FoodItem } from "@/types/food"
import { getFoods, removeUser, type User } from "@/lib/localStorage"

interface DashboardProps {
  user: User
  onUserChange: (user: User | null) => void
}

export default function Dashboard({ user, onUserChange }: DashboardProps) {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { toast } = useToast()

  // Load foods from localStorage
  const loadFoods = () => {
    const savedFoods = getFoods()
    setFoods(savedFoods)
    setLoading(false)
  }

  useEffect(() => {
    loadFoods()
  }, [])

  const handleSignOut = () => {
    removeUser()
    onUserChange(null)
    toast({
      title: "Signed out successfully 👋",
      description: "See you next time!",
    })
  }

  const getExpiryStats = () => {
    const now = new Date()
    const expired = foods.filter((food) => new Date(food.expiryDate) < now).length
    const expiringSoon = foods.filter((food) => {
      const expiryDate = new Date(food.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
    }).length
    const fresh = foods.filter((food) => {
      const expiryDate = new Date(food.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry > 3
    }).length

    return { expired, expiringSoon, fresh, total: foods.length }
  }

  const stats = getExpiryStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Apple className="h-6 w-6 text-white animate-pulse" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-spin" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  FoodTracker
                </h1>
                <div className="flex items-center space-x-1">
                  <span className="text-sm animate-bounce">🍎</span>
                  <span className="text-sm animate-bounce animation-delay-100">🥕</span>
                  <span className="text-sm animate-bounce animation-delay-200">🥛</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Welcome back! 👋</div>
                <div className="text-xs text-gray-600 flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500 animate-pulse" />
                  {user.name || user.email.split("@")[0]}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 transform hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Items</CardTitle>
              <div className="relative">
                <Apple className="h-5 w-5 text-blue-600 animate-pulse" />
                <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-green-500 animate-bounce" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-700 flex items-center">
                <span>Food items tracked</span>
                <span className="ml-1 animate-bounce">📊</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 transform hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Fresh Items</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.fresh}</div>
              <p className="text-xs text-green-700 flex items-center">
                <span>Still fresh</span>
                <span className="ml-1 animate-spin">✨</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 transform hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Expiring Soon</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.expiringSoon}</div>
              <p className="text-xs text-yellow-700 flex items-center">
                <span>Within 3 days</span>
                <span className="ml-1 animate-bounce">⏰</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 transform hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Expired</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.expired}</div>
              <p className="text-xs text-red-700 flex items-center">
                <span>Need attention</span>
                <span className="ml-1 animate-ping">⚠️</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="foods" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50">
              <TabsTrigger
                value="foods"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                <Utensils className="h-4 w-4 animate-pulse" />
                <span>My Foods</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Brain className="h-4 w-4 animate-pulse" />
                <span>AI Assistant</span>
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2 animate-pulse" />
              Add Food
              <span className="ml-1 animate-bounce">🍽️</span>
            </Button>
          </div>

          <TabsContent value="foods">
            <FoodList foods={foods} loading={loading} onFoodsChange={loadFoods} />
          </TabsContent>

          <TabsContent value="ai">
            <AIFeatures foods={foods} />
          </TabsContent>
        </Tabs>
      </div>

      <AddFoodDialog open={showAddDialog} onOpenChange={setShowAddDialog} userId={user.id} onFoodAdded={loadFoods} />
    </div>
  )
}
