const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    // User Message
    chatBox.innerHTML += `
        <div style="text-align:right;margin:10px 0;">
            <span style="background:#2563eb;color:white;padding:10px 15px;border-radius:10px;display:inline-block;max-width:80%;word-wrap:break-word;">
                ${message}
            </span>
        </div>
    `;

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Loading Message
    chatBox.innerHTML += `
        <div class="bot" id="loading">
            🤖 Thinking...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("https://sarkar-smart-ai.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const loading = document.getElementById("loading");
        if (loading) loading.remove();

        const data = await response.json();

        if (!response.ok) {
            chatBox.innerHTML += `
                <div class="bot">
                    ❌ ${data.reply}
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
            return;
        }

        chatBox.innerHTML += `
            <div class="bot">
                🤖 ${data.reply}
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        const loading = document.getElementById("loading");
        if (loading) loading.remove();

        console.error(error);

        chatBox.innerHTML += `
            <div class="bot">
                ❌ Unable to connect to Sarkar Smart AI Server.
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;
    }

}