import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { getAIResponse } from "./services/openai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Current Directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Public Folder
app.use(express.static(path.join(__dirname, "public")));

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

        const reply = await getAIResponse(message);

        res.json({
            reply
        });

    } catch (error) {

        console.error("\n========== ERROR ==========");
        console.error(error);
        console.error("===========================\n");

        res.status(500).json({
            reply: "Server Error"
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sarkar Smart AI V2 running on http://localhost:${PORT}`);
});