import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files (index.html, style.css, script.js)
app.use(express.static("."));

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not found in .env file");
    process.exit(1);
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Home page
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "." });
});


// AI Chat API
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
                    content:
                        "You are Sarkar Smart AI. You help teachers, students and parents. Always reply in the same language as the user's question."
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

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});