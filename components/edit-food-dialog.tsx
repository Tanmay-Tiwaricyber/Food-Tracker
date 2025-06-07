"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { FoodItem } from "@/types/food"
import { updateFood } from "@/lib/localStorage"
import { Loader2, Star } from "lucide-react"

interface EditFoodDialogProps {
  food: FoodItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onFoodUpdated: () => void
}

export default function EditFoodDialog({ food, open, onOpenChange, onFoodUpdated }: EditFoodDialogProps) {
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
  const { toast } = useToast()

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        category: food.category,
        quantity: food.quantity,
        unit: food.unit,
        expiryDate: food.expiryDate,
        location: food.location || "",
        notes: food.notes || "",
      })
    }
  }, [food])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      updateFood(food.id, formData)
      onFoodUpdated()

      toast({
        title: "Food updated successfully! ✅",
        description: `${formData.name} has been updated.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error updating food",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-green-50/30 border-2 border-green-200/50">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center space-x-2 text-2xl">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Edit Food Item
            </span>
            <span className="animate-bounce">✏️</span>
          </DialogTitle>
          <DialogDescription>Update the details of your food item.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center">
                Food Name *
                <Star className="h-3 w-3 ml-1 text-yellow-500 animate-pulse" />
              </Label>
              <Input
                id="edit-name"
                placeholder="e.g., Apples 🍎"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="border-2 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
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
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                placeholder="e.g., 5"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                className="border-2 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit *</Label>
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
            <Label htmlFor="edit-expiryDate" className="flex items-center">
              Expiry Date *<span className="ml-1 animate-pulse">📅</span>
            </Label>
            <Input
              id="edit-expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="border-2 focus:border-green-400 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Storage Location</Label>
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
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
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
                  Updating...
                </>
              ) : (
                <>
                  Update Food
                  <span className="ml-1 animate-bounce">✅</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
