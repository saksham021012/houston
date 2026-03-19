import { SYSTEM_PROMPT } from "@/app/lib/systemPrompt";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "deepseek-r1-distill-llama-70b",
  "mixtral-8x7b-32768",
];

async function tryModel(model: string, messages: object[]): Promise<Response | null> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (response.status === 429 || response.status === 503) {
    console.warn(`[CAPCOM] ${model} rate limited (${response.status}), trying next...`);
    return null;
  }

  return response;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  let response: Response | null = null;
  let usedModel = "";

  for (const model of GROQ_MODELS) {
    response = await tryModel(model, apiMessages);
    if (response) {
      usedModel = model;
      break;
    }
  }

  if (!response) {
    return new Response(
      JSON.stringify({ error: "All Groq models rate limited. Try again shortly." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[CAPCOM] Groq error:", response.status, errorText);
    return new Response(
      JSON.stringify({ error: "Groq API error", details: errorText }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(`[CAPCOM] Serving with: ${usedModel}`);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response!.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Model-Used": usedModel,
    },
  });
}