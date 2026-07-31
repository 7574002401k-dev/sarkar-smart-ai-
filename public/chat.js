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

        <div class="message-actions">

            <button class="copy-btn">
                📋 Copy
            </button>

            <button class="regen-btn">
                🔄 Regenerate
            </button>

        </div>

    </div>

    `;

    const copyButtons = document.querySelectorAll(".copy-btn");
    const copyBtn = copyButtons[copyButtons.length - 1];

    if (copyBtn) {

        copyBtn.onclick = () => {

            navigator.clipboard.writeText(message);

            copyBtn.innerHTML = "✅ Copied";

            setTimeout(() => {

                copyBtn.innerHTML = "📋 Copy";

            }, 1500);

        };

    }

    const regenButtons = document.querySelectorAll(".regen-btn");
    const regenBtn = regenButtons[regenButtons.length - 1];

    if (regenBtn) {

        regenBtn.onclick = () => {

            alert("🔄 Regenerate feature coming soon.");

        };

    }

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


function formatResponse(text){

    if (!text) {
        return "❌ No response received from AI.";
    }

    return text

    // Escape HTML
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")

    // Code Blocks
    .replace(/```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>")

    // Inline Code
    .replace(/`([^`]+)`/g,
        "<code>$1</code>")

    // Bold
    .replace(/\*\*(.*?)\*\*/g,
        "<strong>$1</strong>")

    // Italic
    .replace(/\*(.*?)\*/g,
        "<em>$1</em>")

    // Headings
    .replace(/^### (.*)$/gm,
        "<h3>$1</h3>")

    .replace(/^## (.*)$/gm,
        "<h2>$1</h2>")

    .replace(/^# (.*)$/gm,
        "<h1>$1</h1>")

    // Numbered List
    .replace(/^([0-9]+)\.\s(.*)$/gm,
        "<div class='number-item'>$1. $2</div>")

    // Bullet List (-)
    .replace(/^- (.*)$/gm,
        "<div class='bullet-item'>• $1</div>")

    // Bullet List (•)
    .replace(/^•\s(.*)$/gm,
        "<div class='bullet-item'>• $1</div>")

    // Horizontal Line
    .replace(/^---$/gm,
        "<hr>")

    // Line Break
    .replace(/\n/g,"<br>");
}