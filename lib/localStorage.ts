import type { FoodItem } from "@/types/food"

const FOODS_KEY = "foodtracker_foods"
const USER_KEY = "foodtracker_user"

export interface User {
  id: string
  email: string
  name: string
}

// User management
export const saveUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  }
  return null
}

export const removeUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY)
  }
}

// Food management
export const saveFoods = (foods: FoodItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FOODS_KEY, JSON.stringify(foods))
  }
}

export const getFoods = (): FoodItem[] => {
  if (typeof window !== "undefined") {
    const foods = localStorage.getItem(FOODS_KEY)
    return foods ? JSON.parse(foods) : []
  }
  return []
}

export const addFood = (food: Omit<FoodItem, "id" | "createdAt" | "updatedAt">): FoodItem => {
  const newFood: FoodItem = {
    ...food,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const foods = getFoods()
  const updatedFoods = [...foods, newFood]
  saveFoods(updatedFoods)
  return newFood
}

export const updateFood = (id: string, updates: Partial<FoodItem>): void => {
  const foods = getFoods()
  const updatedFoods = foods.map((food) =>
    food.id === id ? { ...food, ...updates, updatedAt: new Date().toISOString() } : food,
  )
  saveFoods(updatedFoods)
}

export const deleteFood = (id: string): void => {
  const foods = getFoods()
  const updatedFoods = foods.filter((food) => food.id !== id)
  saveFoods(updatedFoods)
}
