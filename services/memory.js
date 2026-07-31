import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Memory File
const memoryFile = path.join(__dirname, "..", "data", "conversations.json");


// ===============================
// Load Memory
// ===============================

function loadMemory() {

    try {

        if (!fs.existsSync(memoryFile)) {

            fs.writeFileSync(
                memoryFile,
                JSON.stringify({}, null, 2)
            );

        }

        const data = fs.readFileSync(
            memoryFile,
            "utf8"
        );

        return data ? JSON.parse(data) : {};

    } catch (error) {

        console.log("❌ Memory Load Error:", error);

        return {};

    }

}


// ===============================
// Save Memory
// ===============================

function saveMemory(data) {

    try {

        fs.writeFileSync(
            memoryFile,
            JSON.stringify(data, null, 2)
        );

    } catch (error) {

        console.log("❌ Memory Save Error:", error);

    }

}


// ===============================
// Get User Memory
// ===============================

export function getMemory(userId = "default") {

    const memory = loadMemory();

    if (!memory[userId]) {

        memory[userId] = [];

        saveMemory(memory);

    }

    return memory[userId];

}


// ===============================
// Add New Memory
// ===============================

export function addMessage(userId = "default", role, content) {

    const memory = loadMemory();

    if (!memory[userId]) {

        memory[userId] = [];

    }

    memory[userId].push({

        role,
        content,
        time: new Date().toISOString()

    });

    // Keep only last 20 messages
    if (memory[userId].length > 20) {

        memory[userId] = memory[userId].slice(-20);

    }

    saveMemory(memory);

    console.log("🧠 Memory Updated");

}


// ===============================
// Clear Memory
// ===============================

export function clearMemory(userId = "default") {

    const memory = loadMemory();

    memory[userId] = [];

    saveMemory(memory);

    console.log("🗑️ Memory Cleared");

}