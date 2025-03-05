import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    const { messages, conversationMode = "standard" } = body;
    
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    
    // Prepare messages array with appropriate system instruction based on mode
    let formattedMessages = [...messages];
    
    // Check if there's already a system message
    const hasSystemMessage = messages.some((msg: { role: string }) => msg.role === "system");
    
    // Apply different system prompts based on conversation mode
    if (!hasSystemMessage) {
      let systemContent = "";
      
      switch (conversationMode) {
        case "code":
          systemContent = "You are an expert coding assistant. Provide clear, efficient code solutions with explanations. Focus on best practices, maintainability, and performance.";
          break;
        case "creative":
          systemContent = "You are a creative conversational partner. Engage with imagination, generate innovative ideas, and provide thoughtful, nuanced responses.";
          break;
        case "concise":
          systemContent = "You are a concise assistant. Provide brief, direct answers without unnecessary elaboration while maintaining helpfulness.";
          break;
        default: // standard mode
          systemContent = "You are a helpful assistant that provides accurate, insightful, and contextually appropriate responses. Balance depth with clarity, adapt to the user's needs, and maintain a conversational tone.";
      }
      
      formattedMessages = [
        { role: "system", content: systemContent },
        ...messages
      ];
    }
    
    // Adjust parameters based on conversation mode
    const temperature = conversationMode === "code" ? 0.2 : 
                        conversationMode === "creative" ? 0.9 : 
                        conversationMode === "concise" ? 0.5 : 0.7;
    
    const max_tokens = conversationMode === "concise" ? 1024 : 2048;
    
    // Select appropriate model
    const model = conversationMode === "code" ? "deepseek-coder" : "deepseek-chat";
    
    const response = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
      temperature: temperature,
      max_tokens: max_tokens,
      top_p: 0.9,
      frequency_penalty: conversationMode === "creative" ? 0.2 : 0,
      presence_penalty: conversationMode === "creative" ? 0.4 : 0,
    });
    
    return NextResponse.json(response.choices[0].message);
    
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}