import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use your Gemini API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp", {
        apiKey: apiKey,
      }),
      prompt: prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
