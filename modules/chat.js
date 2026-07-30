import { scrollBottom, escapeHtml } from "./utils.js";

export function addUserMessage(chatBox, message) {

    chatBox.innerHTML += `
        <div class="user-message">
            👤 ${escapeHtml(message)}
        </div>
    `;

    scrollBottom(chatBox);
}

export function addBotMessage(chatBox, message) {

    chatBox.innerHTML += `
        <div class="bot-message">

            🤖 ${message}

            <div style="margin-top:12px;">
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

    scrollBottom(chatBox);
}

export function addTyping(chatBox) {

    const div = document.createElement("div");

    div.className = "bot-message typing";

    div.innerHTML = "🤖 Thinking...";

    chatBox.appendChild(div);

    scrollBottom(chatBox);

    return div;
}