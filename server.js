import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import cors from 'cors';
import helmet from 'helmet';
import open from 'open';
import mammoth from 'mammoth';
import ExcelJS from 'exceljs';
import { OpenAI } from 'openai';

const app = express();

// OpenAI SDK Initialize
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE"
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Security Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Multer Memory Setup
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB Limit
});

// 🧠 AI Helper Function with Direct YouTube Link Enforcement
async function getAIResponse(prompt, history = []) {
    try {
        const messages = [
            { 
                role: "system", 
                content: `You are an official multi-purpose AI educational and administrative assistant for Gujarat & India. 
CRITICAL RULES REGARDING SOURCES & ACCURACY:
1. Direct YouTube Links Enforcement: When any user requests a song, video, or media content, you MUST ALWAYS provide the actual clickable Markdown link in format [Video Title](https://www.youtube.com/watch?v=...) along with the official channel name. Never refuse or say you cannot provide links.
2. First Priority: Always fetch and base your answers strictly on official data, rules, circulars, notifications, and letters from official portals and departments such as GCERT, NCERT, SSA, CBSE, Gujarat e-Sarkar, PARAKH, SWAYAM, SEBC, Forest Department, and recognized official content sources (like Saregama for songs).
3. At the very end of your response, you MUST explicitly specify the verified source short-form in format like: [Source: GCERT/NCERT], [Source: YouTube/Saregama], [Source: SSA Gujarat], or [Source: Gujarat e-Sarkar].
4. If specific official data/circular is not found and you are providing general or logical assistance, clearly specify the source tag as: [Source: AI Generated].
5. Reply strictly in the language requested by the user (Gujarati, English, Hindi, etc.).` 
            },
            ...history.map(h => ({
                role: h.role === 'model' ? 'assistant' : h.role,
                content: h.parts ? h.parts[0].text : h.content
            })),
            { role: "user", content: prompt }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.3,
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("AI Generation Error:", err);
        return "⚠️ AI મોડેલમાંથી જવાબ મેળવવામાં ક્ષતિ આવી છે. [Source: AI Generated]";
    }
}

// 💬 1. Standard Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, imageBase64, history } = req.body;
        let promptText = message || "આ બાબતે વિગતવાર સમજાવો.";

        if (imageBase64) {
            const visionReply = await getAIResponse(`[ઈમેજ સોલ્યુશન/વિશ્લેષણ]: ${promptText}`, history);
            return res.json({ reply: visionReply });
        }

        const reply = await getAIResponse(promptText, history || []);
        res.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ reply: "⚠️ સર્વર એરર આવી. [Source: AI Generated]" });
    }
});

// 🎨 2. Free Image Generator Endpoint
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || prompt.trim() === "") {
            return res.json({ reply: "⚠️ કૃપા કરીને ઈમેજ માટે ડિસ્ક્રિપ્શન લખો." });
        }

        const cleanPrompt = encodeURIComponent(prompt.trim());
        const randomSeed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://pollinations.ai/p/${cleanPrompt}?width=1024&height=1024&seed=${randomSeed}&nologo=true`;

        res.json({
            reply: "✨ તમારું ચિત્ર/પોસ્ટર તૈયાર છે:",
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ reply: "⚠️ ઈમેજ જનરેટ કરવામાં પ્રોબ્લેમ થયો. [Source: AI Generated]" });
    }
});

// 📄 3. Document Parser (PDF, Word, Excel)
app.post('/api/analyze-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ reply: "⚠️ કૃપા કરીને ફાઈલ પસંદ કરો." });
        }

        let extractedText = "";
        const mimeType = req.file.mimetype;

        // PDF Processing
        if (mimeType === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        } 
        // Word Doc (.docx) Processing
        else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        } 
        // Excel (.xlsx) Processing
        else if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);
            workbook.eachSheet((worksheet) => {
                worksheet.eachRow((row) => {
                    extractedText += row.values.join(" | ") + "\n";
                });
            });
        }

        if (!extractedText || extractedText.trim() === "") {
            return res.status(400).json({ reply: "⚠️ ફાઈલમાંથી ટેક્સ્ટ ઉકેલી શકાયું નથી." });
        }

        const userComment = req.body.comment || "આ ડોક્યુમેન્ટનું પૃથ્થકરણ કરો.";
        const fullPrompt = `DOCUMENT TEXT:\n${extractedText.substring(0, 8000)}\n\nUSER REQUEST: ${userComment}`;

        const aiReply = await getAIResponse(fullPrompt);
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("File Analysis Error:", error);
        res.status(500).json({ reply: "⚠️ ડોક્યુમેન્ટ પ્રોસેસિંગમાં ક્ષતિ આવી. [Source: AI Generated]" });
    }
});

// 📝 4. Quiz Generator Endpoint
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { std, subject, chapter, totalMarks, questionTypes } = req.body;
        const prompt = `કૃપા કરીને અધિકૃત GCERT/NCERT અભ્યાસક્રમ મુજબ ધોરણ ${std}, વિષય ${subject}, પ્રકરણ ${chapter} માટે કુલ ${totalMarks} ગુણની ક્વિઝ બનાવો જેમાં નીચેના પ્રકારના પ્રશ્નો સામેલ હોય: ${questionTypes.join(', ')}.`;
        
        const quizReply = await getAIResponse(prompt);
        res.json({ reply: quizReply });
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        res.status(500).json({ reply: "⚠️ ક્વિઝ જનરેટ કરવામાં ક્ષતિ આવી. [Source: AI Generated]" });
    }
});

// Start Server & Open Browser Automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Sarkar Smart AI Server running on http://localhost:${PORT}`);
    await open(`http://localhost:${PORT}`);
});