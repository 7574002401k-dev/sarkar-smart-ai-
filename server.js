import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { getAIResponse } from "./services/openai.js";
import { governmentSearch } from "./government/search.js";

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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
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
        const image = req.body.image || null;

        if (!userMessage) {
            return res.json({
                reply: "Please enter your question."
            });
        }

        // ===============================
        // GOVERNMENT SEARCH
        // ===============================

        console.log("Government Search Called:", userMessage);

        const govResult = await governmentSearch(userMessage);

        console.log("Government Result:", govResult);
        
        if (govResult) {
            return res.json({
                reply: govResult
            });
        }

        // ===============================
        // OPENAI
        // ===============================

        const aiReply = await getAIResponse(
            userMessage,
            pdfText,
            image
        );

        res.json({
            reply: aiReply
        });

    } catch (error) {

        console.error("CHAT ERROR");
        console.error(error);

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
        console.log("Image Prompt:", req.body.prompt);

        const imageResponse = await client.images.generate({
            model: "gpt-image-1",
            prompt: req.body.prompt,
            size: "1024x1024"
        });

        console.log("OpenAI Response:", imageResponse);

        const image = imageResponse.data?.[0];

        if (!image) {
            return res.status(500).json({
                error: "No image returned from OpenAI."
            });
        }

        // URL મળ્યો હોય તો
        if (image.url) {
            return res.json({
                image: image.url
            });
        }

        // Base64 મળ્યો હોય તો
        if (image.b64_json) {
            return res.json({
                image: `data:image/png;base64,${image.b64_json}`
            });
        }

        return res.status(500).json({
            error: "Unknown image response format.",
            response: imageResponse
        });

    } catch (error) {

        console.error("IMAGE ERROR");
        console.error(error);

        res.status(500).json({
            error: error.message,
            details: error
        });
    }
});

// ===============================
// IMAGE ANALYZER API
// ===============================

app.post("/analyze-image", async (req, res) => {

    try {

        const { image } = req.body;

        if (!image) {

            return res.status(400).json({
                error: "No image received."
            });

        }

        const response = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

                {
                    role: "system",
                    content:
                        "You are an AI Vision Assistant. Explain the image in the same language as the user. If it contains a document, explain it. If it contains maths, solve it. If it contains a plant, animal or object, identify it."
                },

                {
                    role: "user",
                    content: [

                        {
                            type: "text",
                            text: "Analyze this image."
                        },

                        {
                            type: "image_url",
                            image_url: {
                                url: image
                            }
                        }

                    ]
                }

            ]

        });

        res.json({

            reply: response.choices[0].message.content

        });

    }

    catch (error) {

        console.error("VISION ERROR");

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

});

// ===============================
// QUIZ GENERATOR API
// ===============================

app.post("/generate-quiz", async (req, res) => {

    try {

        const {
            topic,
            className,
            subject,
            difficulty,
            count
        } = req.body;

        const prompt = `
Generate a ${count} question quiz.

Class: ${className}
Subject: ${subject}
Difficulty: ${difficulty}
Topic: ${topic}

Rules:
- MCQ format
- 4 options (A, B, C, D)
- Mention correct answer after every question.
- Language should match the topic language.
`;

        const response = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content: "You are an expert quiz generator."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]

        });

        res.json({

            quiz: response.choices[0].message.content

        });

    }

    catch (error) {

    console.error("========== QUIZ ERROR ==========");
    console.error(error);

    console.error("Message:", error.message);

    if (error.status) {
        console.error("Status:", error.status);
    }

    if (error.code) {
        console.error("Code:", error.code);
    }

    if (error.response) {
        console.error("Response:", error.response.data);
    }

    res.status(500).json({
        quiz: "❌ Unable to generate quiz."
    });

}

});

// ===============================
// SERVER START
// ===============================

app.listen(PORT, () => {

    console.log(`🚀 Sarkar Smart AI Server running at http://localhost:${PORT}`);

});

