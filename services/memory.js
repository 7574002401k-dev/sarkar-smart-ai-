import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const memoryFile = path.join(__dirname, "..", "data", "conversations.json");

// Create file if it doesn't exist
if (!fs.existsSync(memoryFile)) {
    fs.writeFileSync(memoryFile, JSON.stringify({}, null, 2));
}

// Read memory
export function getMemory(userId = "default") {

    const data = JSON.parse(fs.readFileSync(memoryFile, "utf8"));

    return data[userId] || [];

}

// Save memory
export function saveMemory(userId = "default", messages = []) {

    const data = JSON.parse(fs.readFileSync(memoryFile, "utf8"));

    data[userId] = messages;

    fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));

}