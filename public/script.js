import {
    addUserMessage,
    addBotMessage,
    addTyping
} from "./chat.js";

import {
    scrollBottom,
    escapeHtml
} from "./utils.js";

import { readPDF } from "./modules/pdf.js";


const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
let currentPdfText = "";
const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const imageCreatorBtn = document.getElementById("imageCreatorBtn");
const imageGenerator = document.getElementById("imageGenerator");

const container = document.querySelector(".container");

const micBtn = document.getElementById("micBtn");

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

const startBtn = document.getElementById("startChatBtn");

const pdfBtn = document.getElementById("pdfBtn");
const pdfSection = document.getElementById("pdfSection");
const pdfFile = document.getElementById("pdfFile");
const readPdfBtn = document.getElementById("readPdfBtn");
const pdfResult = document.getElementById("pdfResult");



/* ================= SIDEBAR ================= */


if(menuBtn){

menuBtn.onclick = () => {

    sidebar.classList.add("active");

};

}


if(closeBtn){

closeBtn.onclick = () => {

    sidebar.classList.remove("active");

};

}



/* ================= START CHAT ================= */


if(startBtn){

startBtn.onclick = () => {


    container.scrollIntoView({

        behavior:"smooth"

    });


    userInput.focus();


};

}



/* ================= SEND MESSAGE ================= */


if(sendBtn){

sendBtn.onclick = sendMessage;

}


if(userInput){

userInput.addEventListener("keypress",(e)=>{


    if(e.key==="Enter"){

        sendMessage();

    }


});

}



async function sendMessage(){


const message = userInput.value.trim();


if(!message) return;



addUserMessage(chatBox, message);


userInput.value="";


const loading = addTyping(chatBox);



try{


const response = await fetch(

"https://sarkar-smart-ai.onrender.com/chat",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body: JSON.stringify({
    message: message,
    pdfText: currentPdfText
})

}

);



if (!response.ok) {
    throw new Error("Server Error");
}

const data = await response.json();



loading.remove();



addBotMessage(chatBox, "❌ Server connection error.");



saveChat(chatBox.innerHTML);



speak(data.reply);



}

catch(error){


loading.remove();


addBotMessage(
"❌ Server connection error."
);


console.log(error);


}



scrollBottom(chatBox);



}




/* ================= CHAT HISTORY ================= */


const historyBtn =
document.getElementById("historyBtn");


const historyPanel =
document.getElementById("historyPanel");


const closeHistory =
document.getElementById("closeHistory");


const historyList =
document.getElementById("historyList");


const newChatBtn =
document.getElementById("newChatBtn");



let chats =
JSON.parse(localStorage.getItem("chatHistory")) || [];



if(historyBtn){

historyBtn.onclick=()=>{


historyPanel.classList.add("active");


loadHistory();


};

}



if(closeHistory){

closeHistory.onclick=()=>{


historyPanel.classList.remove("active");


};

}




if(newChatBtn){

newChatBtn.onclick=()=>{


chatBox.innerHTML="";


};

}




function saveChat(text){


chats.unshift({
time:new Date().toLocaleString(),

text:text


});


localStorage.setItem(

"chatHistory",

JSON.stringify(chats)

);


}



function loadHistory(){


historyList.innerHTML="";


chats.forEach(chat=>{


let div=document.createElement("div");


div.className="history-item";


div.innerHTML=

`

<b>${chat.time}</b>

<br><br>

${chat.text.substring(0,80)}...

`;



div.onclick=()=>{


chatBox.innerHTML=chat.text;


historyPanel.classList.remove("active");


};



historyList.appendChild(div);



});


}





/* ================= VOICE ================= */



const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;



if(SpeechRecognition){


const recognition = new SpeechRecognition();


recognition.lang="gu-IN";


recognition.continuous=false;



if(micBtn){


micBtn.onclick=()=>{


recognition.start();


};

}




recognition.onresult=(event)=>{


userInput.value =

event.results[0][0].transcript;


sendMessage();


};



}






/* ================= TEXT TO SPEECH ================= */



function speak(text){


if(!window.speechSynthesis)

return;


let speech =

new SpeechSynthesisUtterance(text);


speech.lang="gu-IN";


speech.rate=1;



window.speechSynthesis.speak(speech);



}





/* ================= IMAGE CREATOR ================= */



if(imageCreatorBtn){


imageCreatorBtn.onclick=()=>{


container.style.display="none";


imageGenerator.style.display="block";


sidebar.classList.remove("active");



imageGenerator.scrollIntoView({

behavior:"smooth"

});


};


}


/* ================= PDF ASSISTANT ================= */

if (pdfBtn) {

    pdfBtn.onclick = () => {

        container.style.display = "none";
        imageGenerator.style.display = "none";
        pdfSection.style.display = "block";

        sidebar.classList.remove("active");

        pdfSection.scrollIntoView({
            behavior: "smooth"
        });

    };

}

/* ================= AI CHAT ================= */

if (chatBtn) {

    chatBtn.onclick = () => {

        container.style.display = "block";
        pdfSection.style.display = "none";
        imageGenerator.style.display = "none";

        sidebar.classList.remove("active");

        container.scrollIntoView({
            behavior: "smooth"
        });

    };

}


if (readPdfBtn) {

    readPdfBtn.onclick = async () => {

        const file = pdfFile.files[0];

        if (!file) {
            alert("Please select a PDF file.");
            return;
        }

        pdfResult.innerHTML = "📖 Reading PDF...";

        try {

            const text = await readPDF(file);

// Clean PDF Text
const cleaned = text

    .replace(/\n\s*\n/g, "\n")
    .replace(/•\s*\n\s*/g, "• ")
    .replace(/:\s*\n\s*/g, ": ")
    .replace(/[ \t]+/g, " ")
    .trim();

currentPdfText = cleaned;

const words = cleaned.trim().split(/\s+/).length;
const chars = cleaned.length;

const preview = cleaned.substring(0, 3000);

pdfResult.innerHTML = `
    <div class="pdf-info">

        <h3>📄 ${file.name}</h3>

        <p><b>Characters:</b> ${chars.toLocaleString()}</p>

        <p><b>Words:</b> ${words.toLocaleString()}</p>

        <hr>

        <h4>Preview</h4>

        <div class="pdf-preview">

            ${preview.replace(/\n/g,"<br>")}

        </div>

    </div>
`;

        } catch (err) {

            console.error(err);

            pdfResult.innerHTML =
                "❌ Unable to read PDF.";

        }

    };

}


/* ================= COUNTER ================= */


document.querySelectorAll(".stat-card h2")

.forEach(counter=>{


let text=counter.innerText;


let number=parseInt(

text.replace(/\D/g,"")

);



if(!number) return;



let value=0;



let timer=setInterval(()=>{


value+=Math.ceil(number/50);



if(value>=number){


value=number;


clearInterval(timer);


}



if(text.includes("M")){


counter.innerText=value.toLocaleString()+"+";


}

else if(text.includes("24")){


counter.innerText="24×7";


}

else{


counter.innerText=value.toLocaleString()+"+";


}



},30);



});