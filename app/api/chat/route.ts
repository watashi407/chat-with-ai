import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";

// Define types for request body
const RequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

// Keywords to identify Alvin-related queries
const ALVIN_KEYWORDS = ["alvin", "alvin gultiano", "watashi"];

export const maxDuration = 30;
// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsedBody = RequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: parsedBody.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get all user messages
    const userMessages = parsedBody.data.messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content.toLowerCase());

    // Check if the query is Alvin-related
    const isAlvinRelated = userMessages.some((message) =>
      ALVIN_KEYWORDS.some((keyword) => message.includes(keyword))
    );

    // Initialize Anthropic client
    const model = anthropic("claude-3-haiku-20240307");

    // Define system prompt based on context
    const systemPrompt = isAlvinRelated
      ? // Alvin-specific prompt
        `You are a helpful AI assistant that can answer any question, but you have special knowledge about Alvin Gultiano (Watashi).

When answering questions about Alvin, use this information:

👨‍💻 Who is Alvin?
A passionate Full-Stack Developer who loves building web applications
Known as "Watashi" in the developer community
Enthusiastic about modern web technologies and best practices

🚀 Current Role & Aspirations:
- Full-Stack Developer
- Passionate about building scalable web applications
- Dreams of creating impactful SaaS solutions

🛠️ Tech Stack:
Frontend:
- ⚛️ React with TypeScript
- 🔄 React Query (TanStack)
- ⚡ Next.js 15
Backend:
- 🔥 Supabase
- 🍃 MongoDB
- 💎 Prisma
Dev Tools:
- 🔧 Zoho (previous)
- ⚡ Supabase (current)

📌 Current Projects:
- 🏗️ Building a SaaS project using Supabase
- 🔄 Migrated from Neon to Supabase for better storage support
- 🎯 Focusing on unified service management

🎯 Professional Goals:
- 📈 Mastering Full-Stack Development
- 🧠 Learning essential design patterns
- ✨ Enhancing code quality and performance
- 🚀 Improving API handling and UI states

💡 Past Experience:
- 📝 Developed client communication systems with Zoho Forms
- 🎮 Created a mobile-first gaming website with advanced features
- 🔍 Implemented search, filtering, and favorites functionality

For Alvin-related questions, use emojis and maintain an enthusiastic tone.
For other questions, respond normally as a helpful AI assistant.`
      : // General prompt
        `You are a helpful AI assistant that can provide information and answer questions on any topic. Aim to be helpful, informative, and accurate in your responses.`;

    // Stream the response
    const result = await streamText({
      model: model,
      temperature: 0.7,
      system: systemPrompt,
      messages: parsedBody.data.messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
