import { NextRequest, NextResponse } from "next/server";

// Valid resolution options (DALL·E 3 compatible)
const VALID_RESOLUTIONS = ["512x512", "1024x1024", "1792x1024"];

// Initialize DeepSeek client (ensure DEEPSEEK_API_KEY is in your .env file)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

// Initialize OpenAI client for DALL·E (ensure OPENAI_API_KEY is in your .env file)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = "https://api.openai.com/v1";

// Function to generate a story using DeepSeek V3
async function generateStory(prompt: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API key is missing");
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a creative storyteller. Generate a vivid, positive, and imaginative short story (3-5 sentences) about the user's desired future based on their prompt.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || "Failed to generate story.";
  } catch (error) {
    console.error("Error generating story with DeepSeek:", error);
    throw new Error("Story generation failed");
  }
}

// Function to generate an image using DALL·E
async function generateImage(story: string, resolution: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key is missing from environment variables");
    throw new Error("OpenAI API key is missing");
  }

  const payload = {
    model: "dall-e-3",
    prompt: `A vivid, futuristic scene from: ${story}`,
    n: 1,
    size: resolution, // Directly use resolution as it matches DALL·E 3 options
    quality: "standard",
    response_format: "url",
  };

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get detailed error message
      console.error(`DALL·E API failed: ${response.status} - ${response.statusText} - Details: ${errorText}`);
      throw new Error(`DALL·E API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url; // DALL·E returns a hosted image URL
  } catch (error) {
    console.error("Error generating image with DALL·E:", error);
    return `https://example.com/fallback-image-${resolution}.png`; // Fallback URL
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { prompt, resolution } = await req.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate the resolution
    if (!VALID_RESOLUTIONS.includes(resolution)) {
      return NextResponse.json(
        { error: `Invalid resolution. Must be one of: ${VALID_RESOLUTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate the story using DeepSeek
    const story = await generateStory(prompt);

    // Generate the image using DALL·E
    const imageUrl = await generateImage(story, resolution);

    // Return the response with story and image URL
    return NextResponse.json({ story, imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}