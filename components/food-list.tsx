"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock, Edit, Trash2, Search, Sparkles, Star } from "lucide-react"
import type { FoodItem } from "@/types/food"
import { useToast } from "@/hooks/use-toast"
import EditFoodDialog from "@/components/edit-food-dialog"
import { deleteFood } from "@/lib/localStorage"

interface FoodListProps {
  foods: FoodItem[]
  loading: boolean
  onFoodsChange: () => void
}

export default function FoodList({ foods, loading, onFoodsChange }: FoodListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null)
  const { toast } = useToast()

  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return "expired"
    if (daysUntilExpiry <= 3) return "expiring"
    return "fresh"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "expired":
        return (
          <Badge className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            <span>Expired</span>
            <span>💀</span>
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse">
            <Clock className="h-3 w-3" />
            <span>Expiring Soon</span>
            <span>⏰</span>
          </Badge>
        )
      case "fresh":
        return (
          <Badge className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CheckCircle className="h-3 w-3" />
            <span>Fresh</span>
            <span className="animate-spin">✨</span>
          </Badge>
        )
      default:
        return null
    }
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      fruits: "🍎",
      vegetables: "🥕",
      dairy: "🥛",
      meat: "🥩",
      grains: "🌾",
      snacks: "🍿",
      beverages: "🥤",
      other: "🍽️",
    }
    return emojis[category] || "🍽️"
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        deleteFood(id)
        onFoodsChange()
        toast({
          title: "Food item deleted 🗑️",
          description: `${name} has been removed from your list.`,
        })
      } catch (error) {
        toast({
          title: "Error deleting item",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || food.category === categoryFilter
    const matchesStatus = statusFilter === "all" || getExpiryStatus(food.expiryDate) === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-200">
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <Card className="bg-white/80 backdrop-blur-md border-2 border-blue-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 animate-pulse" />
              <Input
                placeholder="Search foods... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 border-2 focus:border-blue-400 transition-all duration-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📂 All Categories</SelectItem>
                <SelectItem value="fruits">🍎 Fruits</SelectItem>
                <SelectItem value="vegetables">🥕 Vegetables</SelectItem>
                <SelectItem value="dairy">🥛 Dairy</SelectItem>
                <SelectItem value="meat">🥩 Meat</SelectItem>
                <SelectItem value="grains">🌾 Grains</SelectItem>
                <SelectItem value="snacks">🍿 Snacks</SelectItem>
                <SelectItem value="beverages">🥤 Beverages</SelectItem>
                <SelectItem value="other">🍽️ Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-2 focus:border-blue-400 transition-all duration-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📊 All Status</SelectItem>
                <SelectItem value="fresh">✨ Fresh</SelectItem>
                <SelectItem value="expiring">⏰ Expiring Soon</SelectItem>
                <SelectItem value="expired">💀 Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Food Grid */}
      {filteredFoods.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300">
          <CardContent>
            <div className="text-8xl mb-6 animate-bounce">🍽️</div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {foods.length === 0 ? "No food items yet!" : "No food items found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {foods.length === 0
                ? "Start by adding your first food item to track its expiry date!"
                : "Try adjusting your search or filters."}
            </p>
            <div className="flex justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500 animate-spin" />
              <Star className="h-5 w-5 text-blue-500 animate-pulse" />
              <Sparkles className="h-5 w-5 text-purple-500 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => {
            const status = getExpiryStatus(food.expiryDate)
            const daysUntilExpiry = Math.ceil(
              (new Date(food.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <Card
                key={food.id}
                className={`transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative overflow-hidden ${
                  status === "expired"
                    ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-red-100"
                    : status === "expiring"
                      ? "bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-200 shadow-yellow-100"
                      : "bg-gradient-to-br from-green-50 to-blue-100 border-2 border-green-200 shadow-green-100"
                }`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl animate-pulse">{getCategoryEmoji(food.category)}</div>
                      <div>
                        <CardTitle className="text-lg font-bold">{food.name}</CardTitle>
                        <CardDescription className="capitalize font-medium">
                          {food.category} • {food.quantity} {food.unit}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-3">
                    <div className="text-sm flex items-center">
                      <span className="font-semibold">Expires:</span>
                      <span className="ml-2">{new Date(food.expiryDate).toLocaleDateString()}</span>
                      {status !== "expired" && (
                        <span className="text-gray-600 ml-2">
                          ({daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""})
                        </span>
                      )}
                    </div>
                    {food.location && (
                      <div className="text-sm flex items-center">
                        <span className="font-semibold">Location:</span>
                        <span className="ml-2 capitalize">{food.location}</span>
                        <span className="ml-1">📍</span>
                      </div>
                    )}
                    {food.notes && (
                      <div className="text-sm">
                        <span className="font-semibold">Notes:</span>
                        <span className="ml-2">{food.notes}</span>
                        <span className="ml-1">📝</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingFood(food)}
                      className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 animate-pulse" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(food.id, food.name)}
                      className="border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 animate-pulse" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {editingFood && (
        <EditFoodDialog
          food={editingFood}
          open={!!editingFood}
          onOpenChange={(open) => !open && setEditingFood(null)}
          onFoodUpdated={onFoodsChange}
        />
      )}
    </div>
  )
}
