import dotenv from "dotenv";
import OpenAI from "openai";
import { getMemory, addMessage } from "./memory.js";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(
    message,
    pdfText = "",
    image = null
) {

    try {

        const userId = "default";

        const msg = message.trim().toLowerCase();

const instantReplies = {
    "hi": "👋 Hello! How can I help you today?",
    "hello": "👋 Hello! How can I help you today?",
    "hey": "👋 Hi! Welcome to Sarkar Smart AI.",
    "thanks": "😊 You're welcome!",
    "thank you": "😊 You're welcome!",
    "bye": "👋 Goodbye! Have a great day!"
};

if (instantReplies[msg]) {
    return instantReplies[msg];
}

        // Save User Message
        addMessage(
            userId,
            "user",
            message
        );

        // Load Conversation History
        const history = getMemory(userId);

        console.log("📚 HISTORY SENT TO AI:", history);

        const completion = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

    {
        role: "system",
        content: `
You are Sarkar Smart AI.

You are an expert AI assistant for Teachers, Students and Parents.

Created by Krunal Patel.

MEMORY RULES:

- Remember previous conversation.
- Use previous messages while replying.
- Maintain context naturally.
- Never ignore previous messages unless user changes topic.

GENERAL RULES:

1. Reply in the same language as the user's latest message.
2. Understand Gujarati, Hindi and English.
3. Understand Gujarati written in English letters.
4. Give accurate educational answers.
5. Never say you are ChatGPT.

FORMATTING RULES:

Essay:
Title
Introduction
Main Body
Conclusion

Story:
Title
Story
Moral

Speech:
Greeting
Body
Conclusion
Thank You

Poem:
Each line on a new line.

Letter:
Proper format with date, subject and closing.

Lesson Plan:
Use headings and bullet points.

MCQ:
Numbered questions with 4 options.

Math:
Show step-by-step solution.

Quiz:
If user asks Quiz,
generate beautiful markdown.

If user asks Table,
use markdown table.

If user asks Code,
always use markdown code block.

If user asks Prayer,
Poem,
Speech,
Letter,
always use proper formatting.

Never answer in one paragraph.

PDF RULES:

If PDF content is provided:

- Use the uploaded PDF as the primary source.
- Answer questions using the PDF whenever possible.
- Summarize the PDF when asked.
- Explain the PDF in Gujarati, Hindi or English.
- Generate Notes, MCQs, Question Answers and Short Notes from the PDF.
- If the answer is not found in the PDF, clearly say so and then provide general knowledge.

Always behave as Sarkar Smart AI.

— Created by Krunal Patel
`
    },

    ...(pdfText
        ? [
            {
                role: "system",
                content: `Uploaded PDF Content:

${pdfText.substring(0, 2000)}`
            }
        ]
        : []),

    

...history,

...(image
    ? [{
        role: "user",
        content: [
            {
                type: "text",
                text: message
            },
            {
                type: "image_url",
                image_url: {
                    url: image
                }
            }
        ]
    }]
    : []),

],

            temperature: 0.3,
            max_tokens:2500

        });

        const aiReply = completion.choices[0].message.content;

        // Save AI Reply
        addMessage(
            userId,
            "assistant",
            aiReply
        );

        return aiReply;

    } catch (error) {

        console.error("OPENAI ERROR:", error);

        return "❌ Sorry, I couldn't process your request right now.";

    }

}