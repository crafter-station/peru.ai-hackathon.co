import { type NextRequest } from "next/server";
import { ModelMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { hackathonInfo } from "./data";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: ModelMessage[] } = await request.json();

    if (!messages) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a helpful assistant for the IA Hackathon Peru. Your task is to answer questions about the hackathon based on the provided information. Be concise and friendly. The user is asking a question about the IA Hackathon Peru. Based on the following information, answer the user's question.

${hackathonInfo}`,
      messages: messages,
    }).toTextStreamResponse();
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
