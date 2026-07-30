import {
    addUserMessage,
    addBotMessage,
    addTyping
} from "./modules/chat.js";

import {
    scrollBottom,
    escapeHtml
} from "./modules/utils.js";const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const imageCreatorBtn = document.getElementById("imageCreatorBtn");
const imageGenerator = document.getElementById("imageGenerator");
const container = document.querySelector(".container");
const micBtn = document.getElementById("micBtn");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const startBtn = document.querySelector(".start-btn");

/* ===========================
   Sidebar
=========================== */

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
});

/* ===========================
   Start Chat Button
=========================== */

if (startBtn) {
    startBtn.addEventListener("click", () => {
        document.querySelector(".container").scrollIntoView({
            behavior: "smooth"
        });

        userInput.focus();
    });
}

/* ===========================
   Send Events
=========================== */

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* ===========================
   Send Message
=========================== */

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addUserMessage(message);

    userInput.value = "";

    const loading = addTyping();

    try {

        const response = await fetch(
            "https://sarkar-smart-ai.onrender.com/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message
                })
            }
        );

        const data = await response.json();

        loading.remove();

        addBotMessage(data.reply);

    } catch (err) {

        loading.remove();

        addBotMessage("❌ Server connection error.");

        console.error(err);

    }

    scrollBottom();

}

/* ===========================
   User Message
=========================== */

function addUserMessage(message) {

    chatBox.innerHTML += `
        <div class="user-message">
            👤 ${escapeHtml(message)}
        </div>
    `;

    scrollBottom();

}

/* ===========================
   Bot Message
=========================== */

function addBotMessage(message) {

    chatBox.innerHTML += `
        <div class="bot-message">

            🤖 ${message}

            <div style="margin-top:12px">

                <button class="copy-btn">📋 Copy</button>

            </div>

        </div>
    `;

    const btns = document.querySelectorAll(".copy-btn");

    const btn = btns[btns.length - 1];

    btn.onclick = () => {

        navigator.clipboard.writeText(message);

        btn.innerHTML = "✅ Copied";

        setTimeout(() => {

            btn.innerHTML = "📋 Copy";

        }, 1500);

    };

saveChat(chatBox.innerHTML);

speak(message);

    scrollBottom();

}

/* ===========================
   AI Typing
=========================== */

function addTyping() {

    const div = document.createElement("div");

    div.className = "bot-message typing";

    div.innerHTML = "🤖 Thinking...";

    chatBox.appendChild(div);

    scrollBottom();

    return div;

}

/* ===========================
   Counter Animation
=========================== */

document.querySelectorAll(".stat-card h2").forEach((counter) => {

    const text = counter.innerText;

    const number = parseInt(text.replace(/\D/g, ""));

    if (!number) return;

    let value = 0;

    const speed = Math.max(10, Math.floor(number / 80));

    const timer = setInterval(() => {

        value += speed;

        if (value >= number) {

            value = number;

            clearInterval(timer);

        }

        if (text.includes("24")) {

            counter.innerText = "24×7";

        }

        else if (text.includes("1M")) {

            counter.innerText = value.toLocaleString() + "+";

        }

        else {

            counter.innerText = value.toLocaleString() + "+";

        }

    }, 20);

});

/* ===========================
   Utilities
=========================== */

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}

function escapeHtml(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}const historyBtn=document.getElementById("historyBtn");
const historyPanel=document.getElementById("historyPanel");
const closeHistory=document.getElementById("closeHistory");
const historyList=document.getElementById("historyList");
const newChatBtn=document.getElementById("newChatBtn");

let chats=JSON.parse(localStorage.getItem("chatHistory"))||[];

historyBtn.onclick=()=>{

historyPanel.classList.add("active");

loadHistory();

};

closeHistory.onclick=()=>{

historyPanel.classList.remove("active");

};

newChatBtn.onclick=()=>{

chatBox.innerHTML="";

};

function saveChat(text){

chats.unshift({

time:new Date().toLocaleString(),

text

});

localStorage.setItem("chatHistory",JSON.stringify(chats));

}

function loadHistory(){

historyList.innerHTML="";

chats.forEach(chat=>{

const div=document.createElement("div");

div.className="history-item";

div.innerHTML=`
<b>${chat.time}</b><br><br>
${chat.text.substring(0,80)}...
`;

div.onclick=()=>{

chatBox.innerHTML=chat.text;

historyPanel.classList.remove("active");

};

historyList.appendChild(div);

});

}/* ===========================
   Voice Recognition
=========================== */

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {

        recognition.start();

        micBtn.classList.add("listening");

    });

    recognition.onresult = (event) => {

        const speech = event.results[0][0].transcript;

        userInput.value = speech;

        setTimeout(() => {

        sendMessage();

    }, 400);

    };

    recognition.onend = () => {

        micBtn.classList.remove("listening");

    };

    recognition.onerror = () => {

        micBtn.classList.remove("listening");

        alert("Voice recognition error.");

    };

} else {

    micBtn.style.display = "none";

    console.log("Speech Recognition not supported.");

}/* ===========================
   Text To Speech
=========================== */

function speak(text){

    if(!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.volume = 1;

    utterance.lang = "en-IN";

    window.speechSynthesis.speak(utterance);

}/* ===========================
   Image Creator Section
=========================== */

imageCreatorBtn.addEventListener("click", () => {

    // Chat Section Hide
    container.style.display = "none";

    // Show Image Generator
    imageGenerator.style.display = "block";

    // Sidebar Close
    sidebar.classList.remove("active");

    // Scroll to Image Generator
    imageGenerator.scrollIntoView({
        behavior: "smooth"
    });

});