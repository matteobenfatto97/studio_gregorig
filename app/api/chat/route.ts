// app/api/chat/route.ts
import { NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // clamp history
    const trimmed: ChatMessage[] = messages
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-5-chat-latest";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "Sei Denty, assistente cordiale di uno studio dentistico in Italia. Dai risposte brevi e chiare, invita a prenotare o chiamare per urgenze. Non fornire diagnosi mediche.",
          },
          ...trimmed,
        ],
        max_output_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json(
        { error: `OpenAI error: ${err}` },
        { status: 500 }
      );
    }

    const data: any = await r.json();
    // Extract text robustly across potential response shapes
    let text = "";
    if (typeof data.output_text === "string") text = data.output_text;
    else if (Array.isArray(data.output)) {
      text = data.output
        .map((o: any) =>
          Array.isArray(o.content)
            ? o.content
                .map((c: any) => c?.text)
                .filter(Boolean)
                .join(" ")
            : o?.content?.text || ""
        )
        .filter(Boolean)
        .join("\n");
    }

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
