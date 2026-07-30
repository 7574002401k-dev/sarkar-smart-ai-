import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

import { getMemory, addMemory } from "./memory.js";


dotenv.config();


const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());

app.use(express.json());



// OpenAI Setup

const client = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY

});




// Home Route

app.get("/", (req,res)=>{

    res.send("🚀 Sarkar Smart AI Server Running Successfully");

});




// ===============================
// CHAT API
// ===============================


app.post("/chat", async(req,res)=>{


try{


const userMessage = req.body.message;


if(!userMessage){

    return res.json({

        reply:"Please enter your question."

    });

}



const userId = "default";



// Save User Message

addMemory(

    userId,

    "user",

    userMessage

);



// Get Previous Chat Memory

const history = getMemory(userId);



console.log("CURRENT MEMORY:", history);




// AI Response

const response = await client.chat.completions.create({


model:"gpt-4o-mini",



messages:[


{

role:"system",

content:`

You are Sarkar Smart AI.

Created by Krunal Patel.

You are an education AI assistant.

Help:
- Students
- Teachers
- Parents


Support:
- GSEB
- CBSE
- NCERT
- Std 1 to 12


Features:
- Notes
- Quiz
- MCQ
- Lesson Plan
- Worksheet
- Science
- Maths
- Essay


Language:

Understand Gujarati, Hindi and English.

Understand Gujarati typed in English letters.

Reply in the same language as user.


Memory:

Use previous conversation context.


Quiz:

When user asks quiz:
First give only questions.

After answers:
Check and explain.


Do not say you are ChatGPT.

Always behave as Sarkar Smart AI.


`

},



...history



]


});





const aiReply = response.choices[0].message.content;




// Save AI Reply

addMemory(

    userId,

    "assistant",

    aiReply

);





res.json({

    reply: aiReply

});



}



catch(error){


console.log("CHAT ERROR:",error);


res.status(500).json({

reply:"❌ Sarkar Smart AI Server Error"

});


}



});
// ===============================
// AI IMAGE GENERATOR API
// ===============================


app.post("/generate-image", async(req,res)=>{


try{


const prompt = req.body.prompt;


if(!prompt){

    return res.json({

        error:"Please enter image description"

    });

}



// Create Image

const imageResponse = await client.images.generate({

    model:"gpt-image-1",

    prompt:prompt,

    size:"1024x1024"

});



const imageUrl = imageResponse.data[0].url;



res.json({

    image:imageUrl

});



}



catch(error){


console.log("IMAGE ERROR:",error);


res.status(500).json({

error:"❌ Image generation failed"

});


}



});




// ===============================
// SERVER START
// ===============================


app.listen(PORT,()=>{


console.log(

`🚀 Sarkar Smart AI Server running at http://localhost:${PORT}`

);


});