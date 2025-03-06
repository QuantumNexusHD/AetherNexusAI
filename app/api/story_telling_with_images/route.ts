import { NextRequest, NextResponse } from "next/server";

const VALID_RESOLUTIONS = ["1024x1024", "1792x1024", "1024x1792"];
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = "https://api.openai.com/v1";

async function generateStory(prompt: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) throw new Error("DeepSeek API key is missing");

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

    if (!response.ok) throw new Error(`DeepSeek API error: ${response.status} - ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content || "Failed to generate story.";
  } catch (error) {
    console.error("Error generating story with DeepSeek:", error);
    throw new Error("Story generation failed");
  }
}

async function generateImage(story: string, resolution: string): Promise<string> {
  if (!OPENAI_API_KEY) throw new Error("OpenAI API key is missing");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  const payload = {
    model: "dall-e-3",
    prompt: `A vivid, futuristic scene from: ${story}`,
    n: 1,
    size: resolution,
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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DALL·E API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    clearTimeout(timeout);
    console.error("Error generating image with DALL·E:", error);
    if (error.name === "AbortError") {
      console.warn("Image generation timed out after 30s");
      return `https://via.placeholder.com/${resolution.replace("x", "/")}?text=Image+Timed+Out`;
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, resolution } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
    }
    if (!VALID_RESOLUTIONS.includes(resolution)) {
      return NextResponse.json({ error: `Invalid resolution. Must be one of: ${VALID_RESOLUTIONS.join(", ")}` }, { status: 400 });
    }

    const story = await generateStory(prompt);
    const imageUrl = await generateImage(story, resolution);

    return NextResponse.json({ story, imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}