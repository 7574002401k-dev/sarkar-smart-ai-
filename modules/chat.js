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
        </div>
    `;

    scrollBottom(chatBox);
}

// ================= TYPING =================

export function addTyping(chatBox) {

    const div = document.createElement("div");

    div.className = "bot-message typing";

    div.innerHTML = "🤖 Thinking...";

    chatBox.appendChild(div);

    scrollBottom(chatBox);

    return div;
}

// ================= FORMAT RESPONSE =================

function formatResponse(text) {

    if (!text) return "❌ No response received.";

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^### (.*)$/gm, "<h3>$1</h3>")
        .replace(/^## (.*)$/gm, "<h2>$1</h2>")
        .replace(/^# (.*)$/gm, "<h1>$1</h1>")
        .replace(/^([0-9]+)\.\s(.*)$/gm, "<div class='number-item'>$1. $2</div>")
        .replace(/^- (.*)$/gm, "<div class='bullet-item'>• $1</div>")
        .replace(/^•\s(.*)$/gm, "<div class='bullet-item'>• $1</div>")
        .replace(/^---$/gm, "<hr>")
        .replace(/\n/g, "<br>");
}