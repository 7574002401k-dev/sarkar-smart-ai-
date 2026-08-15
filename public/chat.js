import { scrollBottom, escapeHtml } from "./utils.js";

// ================= USER MESSAGE =================
export function addUserMessage(chatBox, message) {
    if (!chatBox) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "user-message";
    messageDiv.innerHTML = `👤 ${escapeHtml(message)}`;

    chatBox.appendChild(messageDiv);
    scrollBottom(chatBox);
}

// ================= BOT MESSAGE =================
export function addBotMessage(chatBox, message) {
    if (!chatBox) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "bot-message";
    messageDiv.innerHTML = `🤖 ${formatResponse(message)}`;

    chatBox.appendChild(messageDiv);
    scrollBottom(chatBox);
}

// ================= TYPING INDICATOR =================
export function addTyping(chatBox) {
    if (!chatBox) return null;

    const div = document.createElement("div");
    div.className = "bot-message typing";
    div.innerHTML = "🤖 Thinking...";

    chatBox.appendChild(div);
    scrollBottom(chatBox);

    return div;
}

// ================= FORMAT RESPONSE (MARKDOWN TO HTML) =================
function formatResponse(text) {
    if (!text) {
        return "❌ No response received from AI.";
    }

    // ૧. કોડ બ્લોક્સ (```code```) ને સાચવી લેવા જેથી અંદર <br> અથવા બીજા ફોર્મેટિંગ ન ભળે
    const codeBlocks = [];
    let formatted = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
        return placeholder;
    });

    // ૨. બાકીના સામાન્ય ટેક્સ્ટને સેફ બનાવવું (HTML Escape)
    formatted = escapeHtml(formatted);

    // ૩. ઇનલાઇન કોડ (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");

    // ૪. બોલ્ડ અને ઇટાલિક (**bold**, *italic*)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // ૫. હેડિંગ્સ (#, ##, ###)
    formatted = formatted.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    formatted = formatted.replace(/^## (.*)$/gm, "<h2>$2</h2>");
    formatted = formatted.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    // ૬. લિસ્ટ્સ (Numbered & Bullet)
    formatted = formatted.replace(/^([0-9]+)\.\s(.*)$/gm, "<div class='number-item'>$1. $2</div>");
    formatted = formatted.replace(/^[-•]\s(.*)$/gm, "<div class='bullet-item'>• $1</div>");

    // ૭. લાઇન અને લિંક્સ (Auto URL Links)
    formatted = formatted.replace(/^---$/gm, "<hr>");
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // ૮. ન્યુલાઇનને <br> માં ફેરવવું
    formatted = formatted.replace(/\n/g, "<br>");

    // ૯. કોડ બ્લોક્સને પાછા તેની મૂળ જગ્યાએ સેટ કરવા
    codeBlocks.forEach((block, index) => {
        formatted = formatted.replace(`__CODE_BLOCK_${index}__`, block);
    });

    return formatted;
}