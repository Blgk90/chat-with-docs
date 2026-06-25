import OpenAI from "openai";

import type { ChatRequestBody, ChatResponse } from "@/types/chat";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,

  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Chat With Docs",
  },
});


export async function POST(request: Request) {

  try {
    const body: ChatRequestBody = await request.json();

    const { question, documentText } = body;

    if (!question || !documentText) {
      const responseBody: ChatResponse = {
        success: false,
        message: "Missing question or document text",
      };

      return Response.json(responseBody, {
        status: 400,
      });
    }

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Answer using ONLY the provided document. If the answer is not present in the document, say so.",
          },

          {
            role: "user",
            content: `
            DOCUMENT:

            ${documentText.slice(0, 12000)}

            QUESTION:

            ${question}
                        `,
            },
        ],
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "No answer generated.";

    const responseBody: ChatResponse = {
      success: true,
      answer,
    };

    return Response.json(responseBody);
  } catch (error) {
    console.error("CHAT_ERROR:", error);

    const responseBody: ChatResponse = {
      success: false,
      message: "Chat request failed",
    };

    return Response.json(responseBody, {
      status: 500,
    });
  }
}