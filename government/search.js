import { searchNCERT } from "./ncert.js";
import { searchGCERT } from "./gcert.js";
import { searchCirculars } from "./circulars.js";
import { searchGR } from "./gr.js";
import { searchNews } from "./news.js";

import { detectEducationSource } from "./educationDetector.js";
import { findResource } from "./resourceFinder.js";

export async function governmentSearch(query) {

    // ==========================
    // Education Source Detection
    // ==========================

    const education = detectEducationSource(query);

    if (education === "NCERT") {
        return await searchNCERT(query);
    }

    if (education === "GCERT") {
        return await searchGCERT(query);
    }

    // GSEB Module (Future)
    if (education === "GSEB") {
        return null;
    }

    // ==========================
    // Other Government Resources
    // ==========================

    const resource = findResource(query);

    switch (resource) {

        case "CIRCULAR":
            return await searchCirculars(query);

        case "GR":
            return await searchGR(query);

        case "NEWS":
            return await searchNews(query);

        default:
            return null;

    }

}