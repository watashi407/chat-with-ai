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

export const maxDuration = 30;
export const runtime = "edge"; // Optional: Use Edge runtime for better performance

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsedBody = RequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
      });
    }

    // Check if any message contains 'alvin' (case insensitive)
    const containsAlvin = parsedBody.data.messages.some((msg) =>
      msg.content.toLowerCase().includes("alvin")
    );

    if (!containsAlvin) {
      return new Response(
        JSON.stringify({ error: "Ask only for alvin info" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Anthropic client
    const model = anthropic("claude-3-haiku-20240307");

    // Define system prompt
    const systemPrompt = `You are an expert research assistant. Here is a document you will answer questions about:

<doc>
[Full text of [Matterport SEC filing 10-K 2023](https://investors.matterport.com/node/9501/html), not pasted here for brevity]
</doc>

First, find the quotes from the document that are most relevant to answering the question, and then print them in numbered order. Quotes should be relatively short.

If there are no relevant quotes, write "No relevant quotes" instead.

Then, answer the question, starting with "Answer:". Do not include or reference quoted content verbatim in the answer. Don't say "According to Quote [1]" when answering. Instead make references to quotes relevant to each section of the answer solely by adding their bracketed numbers at the end of relevant sentences.

Thus, the format of your overall response should look like what's shown between the <example></example> tags. Make sure to follow the formatting and spacing exactly.
<example>
Quotes:
[1] "Company X reported revenue of $12 million in 2021."
[2] "Almost 90% of revenue came from widget sales, with gadget sales making up the remaining 10%."

Answer:
Company X earned $12 million. [1] Almost 90% of it was from widget sales. [2]
</example>

If the question cannot be answered by the document, say so.`;

    // Stream the response
    const result = await streamText({
      model: model,
      temperature: 0,
      system: systemPrompt,
      messages: parsedBody.data.messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
