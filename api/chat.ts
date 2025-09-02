import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // du kan byta till gpt-4o eller gpt-3.5 om du vill
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
