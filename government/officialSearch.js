import officialLinks from "../data/official-links.json" with { type: "json" };

export async function officialSearch(resource, query) {

    const data = officialLinks.sources?.[resource.toLowerCase()];

    if (!data) {
        return null;
    }

    return {

        success: true,

        resource,

        query,

        source: data.name,

        website: data.website || "",

        books: data.books || "",

        pdf: data.pdf || "",

        youtube: data.youtube || "",

        instruction: `

The user's question belongs to ${data.name}.

Answer using ${data.name} concepts whenever applicable.

Do not copy-paste official content.

Explain in simple language.

If the official information is not available,
answer using your own knowledge.

At the end ALWAYS mention:

━━━━━━━━━━━━━━━━━━━━━━

📚 Source

${data.name}

${data.website}

`

    };

}