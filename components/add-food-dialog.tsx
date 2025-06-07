"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Camera, Sparkles, Zap, Loader2, Star } from "lucide-react"
import { addFood } from "@/lib/localStorage"

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onFoodAdded: () => void
}

export default function AddFoodDialog({ open, onOpenChange, userId, onFoodAdded }: AddFoodDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    location: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [scanLoading, setScanLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      addFood({
        ...formData,
        userId,
      })

      toast({
        title: "Food added successfully! 🎉",
        description: `${formData.name} has been added to your tracker.`,
      })

      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        location: "",
        notes: "",
      })
      onFoodAdded()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error adding food",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAIRecognition = async () => {
    setAiLoading(true)
    try {
      // Simulate AI food recognition with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Enhanced mock AI response with more realistic data
      const mockFoods = [
        { name: "Organic Bananas", category: "fruits", quantity: "6", unit: "pieces" },
        { name: "Whole Milk", category: "dairy", quantity: "1", unit: "liter" },
        { name: "Chicken Breast", category: "meat", quantity: "500", unit: "grams" },
        { name: "Roma Tomatoes", category: "vegetables", quantity: "4", unit: "pieces" },
        { name: "Sourdough Bread", category: "grains", quantity: "1", unit: "loaf" },
        { name: "Greek Yogurt", category: "dairy", quantity: "500", unit: "grams" },
      ]

      const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)]
      setFormData((prev) => ({
        ...prev,
        ...randomFood,
      }))

      toast({
        title: "AI Recognition Complete! 🤖✨",
        description: `Detected: ${randomFood.name}`,
      })
    } catch (error) {
      toast({
        title: "AI Recognition Failed",
        description: "Please try again or enter manually.",
        variant: "destructive",
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleImageScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setScanLoading(true)
    try {
      // Simulate image processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock image recognition results
      const imageRecognitionResults = [
        { name: "Fresh Apples", category: "fruits", quantity: "5", unit: "pieces" },
        { name: "Cheddar Cheese", category: "dairy", quantity: "200", unit: "grams" },
        { name: "Bell Peppers", category: "vegetables", quantity: "3", unit: "pieces" },
        { name: "Salmon Fillet", category: "meat", quantity: "300", unit: "grams" },
      ]

      const result = imageRecognitionResults[Math.floor(Math.random() * imageRecognitionResults.length)]
      setFormData((prev) => ({
        ...prev,
        ...result,
      }))

      toast({
        title: "Image Scanned Successfully! 📸✨",
        description: `Detected: ${result.name} from your image`,
      })
    } catch (error) {
      toast({
        title: "Image Scan Failed",
        description: "Please try again with a clearer image.",
        variant: "destructive",
      })
    } finally {
      setScanLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200/50">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center space-x-2 text-2xl">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Add New Food Item
            </span>
            <span className="animate-bounce">🍽️</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new food item to track its expiry date with AI assistance
          </DialogDescription>
        </DialogHeader>

        {/* AI Features Row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleAIRecognition}
            disabled={aiLoading}
            className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                AI Suggest
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanLoading}
            className="relative overflow-hidden border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
          >
            {scanLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2 animate-pulse" />
                Scan Image
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Quick fill with random suggestion
              const quickSuggestions = [
                { name: "Apple", category: "fruits" },
                { name: "Bread", category: "grains" },
                { name: "Yogurt", category: "dairy" },
              ]
              const suggestion = quickSuggestions[Math.floor(Math.random() * quickSuggestions.length)]
              setFormData((prev) => ({ ...prev, ...suggestion }))
              toast({ title: "Quick suggestion applied! ⚡" })
            }}
            className="relative overflow-hidden border-2 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200"
          >
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            Quick Fill
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageScan}
          className="hidden"
          capture="environment"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                Food Name *
                <Star className="h-3 w-3 ml-1 text-yellow-500 animate-pulse" />
              </Label>
              <Input
                id="name"
                placeholder="e.g., Organic Apples 🍎"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="border-2 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="border-2 focus:border-green-400 transition-all duration-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                placeholder="e.g., 5"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                className="border-2 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
              >
                <SelectTrigger className="border-2 focus:border-green-400 transition-all duration-200">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="ml">Milliliters</SelectItem>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="tbsp">Tablespoons</SelectItem>
                  <SelectItem value="tsp">Teaspoons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="flex items-center">
              Expiry Date *<span className="ml-1 animate-pulse">📅</span>
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="border-2 focus:border-green-400 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger className="border-2 focus:border-green-400 transition-all duration-200">
                <SelectValue placeholder="Where is it stored?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refrigerator">🧊 Refrigerator</SelectItem>
                <SelectItem value="freezer">❄️ Freezer</SelectItem>
                <SelectItem value="pantry">🏠 Pantry</SelectItem>
                <SelectItem value="counter">🏪 Counter</SelectItem>
                <SelectItem value="cabinet">🗄️ Cabinet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes... 📝"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="border-2 focus:border-green-400 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  Add Food
                  <span className="ml-1 animate-bounce">🎉</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
