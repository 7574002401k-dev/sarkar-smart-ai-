import officialLinks from "../data/official-links.json" with { type: "json" };

export async function officialSearch(resource, query) {

    switch (resource) {

        case "NCERT":

            return {
                success: true,
                source: "NCERT",
                title: "📚 NCERT Official Resources",
                query,
                website: officialLinks.sources.ncert.website,
                books: officialLinks.sources.ncert.books,
                message: "Official NCERT resources found."
            };

        case "GCERT":

            return {
                success: true,
                source: "GCERT",
                title: "📘 GCERT Official Resources",
                query,
                website: officialLinks.sources.gcert.website,
                message: "Official GCERT resources found."
            };

        case "CBSE":

            return {
                success: true,
                source: "CBSE",
                title: "📄 CBSE Official Resources",
                query,
                website: officialLinks.sources.cbse.website,
                message: "Official CBSE resources found."
            };

        case "GSEB":

            return {
                success: true,
                source: "GSEB",
                title: "📖 GSEB Official Resources",
                query,
                website: officialLinks.sources.gseb.website,
                message: "Official GSEB resources found."
            };

        case "DIKSHA":

            return {
                success: true,
                source: "DIKSHA",
                title: "🎥 DIKSHA Official Resources",
                query,
                website: officialLinks.sources.diksha.website,
                message: "Official DIKSHA resources found."
            };

        default:

            return null;

    }

}