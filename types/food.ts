export interface FoodItem {
  id: string
  name: string
  category: string
  quantity: string
  unit: string
  expiryDate: string
  location?: string
  notes?: string
  userId: string
  createdAt: string
  updatedAt: string
  imageUrl?: string
}
