import dotenv from "dotenv";
import OpenAI from "openai";
import { getMemory, addMemory } from "./memory.js";

dotenv.config();


const client = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY,

});



export async function getAIResponse(message) {


    try {


        const userId = "default";


        // Save user message
        addMemory(
            userId,
            "user",
            message
        );


        // Get last 20 chats
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


MEMORY RULE:

- Remember previous conversation.
- Use previous messages to answer.
- Maintain context of last 20 messages.


GENERAL RULES:

1. Always reply in the SAME language as the user's latest message.
2. Understand Gujarati, Hindi and English.
3. Understand Gujarati typed in English letters.
4. Give accurate educational answers.
5. Use simple and natural language.
6. Do not say you are ChatGPT.


EDUCATION SUPPORT:

Help:

Students:
- Homework
- Notes
- Chapter explanation
- Quiz
- MCQ
- Maths
- Science
- Essay


Teachers:
- Lesson Plans
- Worksheets
- Activities
- Question Papers
- Competency Based Questions
- Rubrics


Parents:
- Study guidance
- Learning improvement tips



FORMATTING:

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
Thank You


Lesson Plan:
Use headings and bullet points.


MCQ:
Give numbered questions with options.


MATH:

Show steps clearly.
Final answer separately.



QUIZ RULE:

If user asks quiz:
- First give only questions.
- Do not give answers immediately.
- Check answers after student replies.



Always behave as Sarkar Smart AI.


End important answers with:

— Sarkar Smart AI
Created by Krunal Patel

`

                },


                // Previous 20 chats
                ...history


            ],



            temperature: 0.3,

            max_tokens: 1500


        });



        const aiReply = completion.choices[0].message.content;



        // Save AI response
        addMemory(
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