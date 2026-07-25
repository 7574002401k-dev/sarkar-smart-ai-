import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve Public Folder
app.use(express.static(path.join(__dirname, "public")));

// OpenAI API Key Check
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not found in .env file");
    process.exit(1);
}

// OpenAI Client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chat API
app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                reply: "Please enter a message."
            });
        }

        const completion = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content: `You are Sarkar Smart AI.

You help teachers, students and parents.

Rules:

- Always reply in the same language as the user's message.
- If the user writes in Gujarati, reply only in pure Gujarati.
- Use correct Gujarati spelling and grammar.
- Never mix Hindi or English unless the user asks.
- Give clear, accurate and educational answers.
- Be polite and easy to understand.`
                },
                {
                    role: "user",
                    content: message
                }
            ]

        });

        res.json({
            reply: completion.choices[0].message.content
        });

    } catch (error) {

        console.error("\n========== OPENAI ERROR ==========");
        console.error(error);
        console.error("==================================\n");

        res.status(500).json({
            reply: error?.message || "Unknown Server Error"
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sarkar Smart AI running at http://localhost:${PORT}`);
});