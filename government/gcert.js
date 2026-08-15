import { officialSearch } from "./officialSearch.js";

export async function searchGCERT(query) {

    const result = await officialSearch("GCERT", query);

    if (!result) {
        return null;
    }

    return {

        success: true,

        type: "official",

        source: result.source,

        query,

        website: result.website,

        books: result.books,

        pdf: result.pdf,

        youtube: result.youtube,

        instruction: result.instruction

    };

}