"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ChefHat, Lightbulb, Heart, Calendar, AlertTriangle, Loader2 } from "lucide-react"
import type { FoodItem } from "@/types/food"

interface AIFeaturesProps {
  foods: FoodItem[]
}

export default function AIFeatures({ foods }: AIFeaturesProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<string>("")
  const [nutritionInfo, setNutritionInfo] = useState<string>("")
  const [storageTips, setStorageTips] = useState<string>("")
  const [mealPlan, setMealPlan] = useState<string>("")

  const getExpiringFoods = () => {
    const now = new Date()
    return foods.filter((food) => {
      const expiryDate = new Date(food.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0
    })
  }

  const callGeminiAPI = async (prompt: string) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      return data.text
    } catch (error) {
      console.error("Gemini API error:", error)
      throw error
    }
  }

  const generateRecipes = async () => {
    setLoading("recipes")
    try {
      const expiringFoods = getExpiringFoods()
      const foodList = expiringFoods.map((food) => `${food.name} (${food.quantity} ${food.unit})`).join(", ")

      if (foodList) {
        const prompt = `Create 3 delicious and practical recipes using these ingredients that are expiring soon: ${foodList}. 
                       Make the recipes easy to follow with clear ingredients lists and step-by-step cooking instructions. 
                       Include cooking time and serving size for each recipe. Format with clear headings and bullet points.`

        const text = await callGeminiAPI(prompt)
        setRecipes(text)
      } else {
        setRecipes("No expiring foods found! Add some food items to get personalized recipe suggestions. 🍽️")
      }
    } catch (error) {
      setRecipes("Sorry, I couldn't generate recipes right now. Please try again later! 😅")
    } finally {
      setLoading(null)
    }
  }

  const generateNutritionInfo = async () => {
    setLoading("nutrition")
    try {
      const foodList = foods.map((food) => `${food.name} (${food.quantity} ${food.unit})`).join(", ")

      if (foodList) {
        const prompt = `Provide detailed nutritional analysis and health benefits for these foods: ${foodList}. 
                       Include information about vitamins, minerals, calories per serving, protein content, and specific health benefits. 
                       Also provide tips for maximizing nutritional value and any dietary considerations. 
                       Make it informative but easy to understand with clear sections.`

        const text = await callGeminiAPI(prompt)
        setNutritionInfo(text)
      } else {
        setNutritionInfo("Add some food items to get detailed nutritional information! 🥗")
      }
    } catch (error) {
      setNutritionInfo("Sorry, I couldn't get nutritional information right now. Please try again later! 😅")
    } finally {
      setLoading(null)
    }
  }

  const generateStorageTips = async () => {
    setLoading("storage")
    try {
      const foodList = foods.map((food) => `${food.name} (stored in ${food.location || "unknown location"})`).join(", ")

      if (foodList) {
        const prompt = `Provide comprehensive storage tips and best practices for these foods: ${foodList}. 
                       Include optimal storage conditions (temperature, humidity), how to extend shelf life, 
                       signs of spoilage to watch for, and specific tips for each storage location (fridge, freezer, pantry). 
                       Also include food safety guidelines and tips to prevent waste.`

        const text = await callGeminiAPI(prompt)
        setStorageTips(text)
      } else {
        setStorageTips("Add some food items to get personalized storage tips! 📦")
      }
    } catch (error) {
      setStorageTips("Sorry, I couldn't generate storage tips right now. Please try again later! 😅")
    } finally {
      setLoading(null)
    }
  }

  const generateMealPlan = async () => {
    setLoading("mealplan")
    try {
      const foodList = foods
        .map((food) => `${food.name} (expires: ${food.expiryDate}, quantity: ${food.quantity} ${food.unit})`)
        .join(", ")

      if (foodList) {
        const prompt = `Create a detailed 3-day meal plan using these available foods: ${foodList}. 
                       Prioritize foods that expire sooner to minimize waste. Include breakfast, lunch, and dinner suggestions 
                       with simple preparation methods. Also suggest healthy snacks and provide portion guidance. 
                       Format as Day 1, Day 2, Day 3 with clear meal categories.`

        const text = await callGeminiAPI(prompt)
        setMealPlan(text)
      } else {
        setMealPlan("Add some food items to get a personalized meal plan! 🗓️")
      }
    } catch (error) {
      setMealPlan("Sorry, I couldn't generate a meal plan right now. Please try again later! 😅")
    } finally {
      setLoading(null)
    }
  }

  const expiringFoods = getExpiringFoods()

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI Food Assistant 🤖</span>
          </CardTitle>
          <CardDescription>
            Get personalized recommendations, recipes, and tips powered by Gemini 2.0 Flash
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{foods.length}</div>
              <div className="text-sm text-gray-600">Total Foods Tracked 📊</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{expiringFoods.length}</div>
              <div className="text-sm text-gray-600">Expiring This Week ⏰</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {foods.filter((f) => new Date(f.expiryDate) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Still Fresh ✨</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Soon Alert */}
      {expiringFoods.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Foods Expiring Soon ⚠️</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {expiringFoods.map((food) => (
                <Badge key={food.id} variant="secondary" className="bg-orange-100 text-orange-800">
                  {food.name} - {new Date(food.expiryDate).toLocaleDateString()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Features Tabs */}
      <Tabs defaultValue="recipes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recipes" className="flex items-center space-x-1">
            <ChefHat className="h-4 w-4" />
            <span className="hidden sm:inline">Recipes</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center space-x-1">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Storage</span>
          </TabsTrigger>
          <TabsTrigger value="mealplan" className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Meal Plan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <span>Recipe Suggestions 👨‍🍳</span>
              </CardTitle>
              <CardDescription>Get creative recipes using your expiring ingredients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateRecipes} disabled={loading === "recipes"} className="w-full">
                {loading === "recipes" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Recipes...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-4 w-4 mr-2" />
                    Generate Recipe Ideas 🍳
                  </>
                )}
              </Button>
              {recipes && (
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{recipes}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Nutritional Information 🥗</span>
              </CardTitle>
              <CardDescription>Learn about the nutritional benefits of your foods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateNutritionInfo} disabled={loading === "nutrition"} className="w-full">
                {loading === "nutrition" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Nutrition...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Get Nutrition Info 💪
                  </>
                )}
              </Button>
              {nutritionInfo && (
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{nutritionInfo}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span>Storage Tips 💡</span>
              </CardTitle>
              <CardDescription>Learn how to store your foods properly to extend their life</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateStorageTips} disabled={loading === "storage"} className="w-full">
                {loading === "storage" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting Storage Tips...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Storage Tips 📦
                  </>
                )}
              </Button>
              {storageTips && (
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{storageTips}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mealplan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Meal Planning 🗓️</span>
              </CardTitle>
              <CardDescription>Get a personalized meal plan based on your available foods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateMealPlan} disabled={loading === "mealplan"} className="w-full">
                {loading === "mealplan" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Meal Plan...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Meal Plan 🍽️
                  </>
                )}
              </Button>
              {mealPlan && (
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{mealPlan}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
