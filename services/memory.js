import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'memory.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify([]));
}

export function getChatHistory() {
    try {
        const data = fs.readFileSync(MEMORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export function saveChatMessage(role, content) {
    let history = getChatHistory();
    history.push({ role, content });

    // Keep minimum 20 messages history context saved on server
    if (history.length > 30) {
        history = history.slice(-30);
    }

    fs.writeFileSync(MEMORY_FILE, JSON.stringify(history, null, 2));
}

export function clearHistory() {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify([]));
}