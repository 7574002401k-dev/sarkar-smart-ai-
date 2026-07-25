import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(message) {

    try {

        console.log("📤 Sending request to OpenAI...");
        console.log("User Message:", message);

        const completion = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content: `You are Sarkar Smart AI.

You are an AI assistant for teachers, students and parents.

Rules:
- Always reply in the same language as the user's latest message.
- If the user writes Gujarati, reply in correct Gujarati.
- If the user writes Hindi, reply in Hindi.
- If the user writes English, reply in English.
- Be accurate, educational and helpful.
- If you are unsure, clearly say you are not certain instead of guessing.`
                },
                {
                    role: "user",
                    content: message
                }
            ],

            temperature: 0.3,
            max_tokens: 1000

        });

        console.log("✅ OpenAI Response Received");

        return completion.choices[0].message.content;

    } catch (error) {

        console.error("\n========== OPENAI ERROR ==========");
        console.error("Status :", error.status);
        console.error("Code   :", error.code);
        console.error("Type   :", error.type);
        console.error("Message:", error.message);

        if (error.request_id) {
            console.error("Request ID:", error.request_id);
        }

        console.error(error);
        console.error("=================================\n");

        throw error;
    }
}