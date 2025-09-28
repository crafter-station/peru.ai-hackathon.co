import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import fs from "fs"
import path from "path"

// Configure FAL AI client with API credentials
fal.config({
  credentials: process.env.FAL_API_KEY,
})

// Generate images by editing the base alpaca image using FAL AI
export async function POST(request: NextRequest) {
  try {
    // Extract prompt from form data
    const formData = await request.formData()
    const prompt = formData.get("prompt") as string

    // Validate required prompt parameter
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create enhanced prompt that preserves original image elements
    const basePreservationPrompt = `IMPORTANT: You must preserve every element of the original design exactly as it appears in the source image. This includes, but is not limited to: the alpaca character design, the IA HACKATHON logo, all brand marks, typography, text, color palette, layout, and overall artistic style.
	•	Do not alter, distort, replace, reposition, recolor, or remove any existing branding components.
	•	Do not add overlays, filters, effects, or modifications that could compromise the visibility, proportions, or integrity of the original design.

Your task is to only add or modify elements as explicitly described in the following instructions, while ensuring that the original alpaca, branding, and visual identity remain completely intact and unchanged. The final result must seamlessly integrate any new elements into the existing style without disrupting brand consistency.
    `
    const enhancedPrompt = basePreservationPrompt + prompt

    // Load the base alpaca image
    const imagePath = path.join(process.cwd(), "public", "IA-HACK-PE-LLAMA.png")
    
    if (!fs.existsSync(imagePath)) {
      throw new Error("Base alpaca image not found")
    }

    // Convert base image to base64
    const imageBuffer = fs.readFileSync(imagePath)
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`

    // Generate image using FAL AI nano-banana edit model with base alpaca image
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: enhancedPrompt,
        image_urls: [imageBase64],
        num_images: 1,
        output_format: "jpeg",
      },
    })

    // Validate API response contains generated images
    if (!result.data || !result.data.images || result.data.images.length === 0) {
      throw new Error("No images generated")
    }

    // Extract image URL and AI description from response
    const imageUrl = result.data.images[0].url
    const description = result.data.description || ""

    // Return generated image data (with original user prompt for display)
    return NextResponse.json({
      url: imageUrl,
      prompt: prompt, // Original user prompt for UI display
      description: description,
      enhancedPrompt: enhancedPrompt, // Technical prompt used (for debugging)
    })
  } catch (error) {
    // Return user-friendly error response
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
