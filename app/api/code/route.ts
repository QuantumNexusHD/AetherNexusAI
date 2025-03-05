import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1", // Correct base URL for DeepSeek API
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { messages, model: requestedModel } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Since the frontend specifies "deepseek" as the model, we'll map it to a specific DeepSeek model
    const conversationMode = requestedModel === "deepseek" ? "code" : "standard"; // Default to code mode for this context

    // Prepare messages array with appropriate system instruction based on mode
    let formattedMessages = [...messages];
    const hasSystemMessage = messages.some((msg: { role: string }) => msg.role === "system");

    if (!hasSystemMessage) {
      let systemContent = "";

      switch (conversationMode) {
        case "code":
          systemContent = "You are an expert coding assistant. Provide clear, efficient code solutions with explanations. Focus on best practices, maintainability, and performance.";
          break;
        default: // standard mode
          systemContent = "You are a helpful assistant that provides accurate, insightful, and contextually appropriate responses.";
      }

      formattedMessages = [
        { role: "system", content: systemContent },
        ...messages,
      ];
    }

    // Adjust parameters based on conversation mode
    const temperature = conversationMode === "code" ? 0.2 : 0.7;
    const max_tokens = conversationMode === "code" ? 2048 : 4096; // DeepSeek supports higher token limits
    const selectedModel = conversationMode === "code" ? "deepseek-coder" : "deepseek-chat";

    const response = await openai.chat.completions.create({
      model: selectedModel, // Use deepseek-coder for code generation
      messages: formattedMessages,
      temperature,
      max_tokens,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Return the response in the format expected by the frontend
    return NextResponse.json({
      content: response.choices[0].message.content, // Extract just the content
    });

  } catch (error) {
    console.log("[DEEPSEEK_API_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}