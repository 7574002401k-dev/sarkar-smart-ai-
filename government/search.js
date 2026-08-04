import { searchNCERT } from "./ncert.js";
import { searchGCERT } from "./gcert.js";
import { searchCirculars } from "./circulars.js";
import { searchGR } from "./gr.js";
import { searchNews } from "./news.js";

export async function governmentSearch(query) {

    const q = query.toLowerCase();

    // NCERT
    if (
        q.includes("ncert") ||
        q.includes("chapter") ||
        q.includes("chapter") ||
        q.includes("textbook")
    ) {
        return await searchNCERT(query);
    }

    // GCERT
    if (
        q.includes("gcert") ||
        q.includes("gujarat textbook")
    ) {
        return await searchGCERT(query);
    }

    // Circular
    if (
        q.includes("circular") ||
        q.includes("પરિપત્ર")
    ) {
        return await searchCirculars(query);
    }

    // GR
    if (
        q.includes("gr") ||
        q.includes("ઠરાવ") ||
        q.includes("resolution")
    ) {
        return await searchGR(query);
    }

    // News
    if (
        q.includes("news") ||
        q.includes("સમાચાર")
    ) {
        return await searchNews(query);
    }

    return null;
}