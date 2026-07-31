import { scrollBottom, escapeHtml } from "./utils.js";


// ================= USER MESSAGE =================

export function addUserMessage(chatBox, message) {

    chatBox.innerHTML += `

    <div class="user-message">

        👤 ${escapeHtml(message)}

    </div>

    `;

    scrollBottom(chatBox);

}



// ================= BOT MESSAGE =================

export function addBotMessage(chatBox, message) {


    chatBox.innerHTML += `

    <div class="bot-message">

        🤖 ${formatResponse(message)}

        <div style="margin-top:12px;">

            <button class="copy-btn">
                📋 Copy
            </button>

        </div>

    </div>

    `;



    const buttons = document.querySelectorAll(".copy-btn");


    const btn = buttons[buttons.length - 1];


    if(btn){

        btn.onclick = ()=>{


            navigator.clipboard.writeText(message);


            btn.innerHTML="✅ Copied";


            setTimeout(()=>{

                btn.innerHTML="📋 Copy";

            },1500);


        };

    }



    scrollBottom(chatBox);


}





// ================= TYPING =================


export function addTyping(chatBox){


    const div=document.createElement("div");


    div.className="bot-message typing";


    div.innerHTML="🤖 Thinking...";


    chatBox.appendChild(div);



    scrollBottom(chatBox);



    return div;


}





// ================= FORMAT RESPONSE =================


function formatResponse(text){

    if (!text) {
        return "❌ No response received from AI.";
    }

    return text

    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")

    // Bold
    .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")

    // Headings
    .replace(/^### (.*)$/gm,"<h3>$1</h3>")
    .replace(/^## (.*)$/gm,"<h2>$1</h2>")
    .replace(/^# (.*)$/gm,"<h1>$1</h1>")

    // Bullet
    .replace(/^- (.*)$/gm,"• $1")

    // Line break
    .replace(/\n/g,"<br>");
}