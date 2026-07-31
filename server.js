import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { getAIResponse } from "./services/openai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI Client (Image Generator માટે)
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ES Module માટે __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({
    limit: "20mb"
}));

// Public Folder Serve
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// CHAT API
// ===============================

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;
        const pdfText = req.body.pdfText || "";

        if (!userMessage) {
            return res.json({
                reply: "Please enter your question."
            });
        }

        const aiReply = await getAIResponse(
    userMessage,
    pdfText
);

        res.json({
            reply: aiReply
        });

    } catch (error) {

        console.error("CHAT ERROR:", error);

        res.status(500).json({
            reply: "❌ Sarkar Smart AI Server Error"
        });

    }

});

// ===============================
// IMAGE GENERATOR API
// ===============================

app.post("/generate-image", async (req, res) => {

    try {

        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({
                error: "Please enter image description"
            });
        }

        const imageResponse = await client.images.generate({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024"
        });

        const imageUrl = imageResponse.data?.[0]?.url;

        res.json({
            image: imageUrl
        });

    } catch (error) {

        console.error("IMAGE ERROR:", error);

        res.status(500).json({
            error: "❌ Image generation failed"
        });

    }

});

// ===============================
// SERVER START
// ===============================

app.listen(PORT, () => {

    console.log(`🚀 Sarkar Smart AI Server running at http://localhost:${PORT}`);

});