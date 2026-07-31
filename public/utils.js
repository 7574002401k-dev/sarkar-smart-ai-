// ===========================
// Utilities
// ===========================

export function scrollBottom(chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
}

export function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function formatTime() {
    return new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function formatDate() {
    return new Date().toLocaleDateString("en-IN");
}