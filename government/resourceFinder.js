export function findResource(query) {

    const q = query.toLowerCase();

    // ==========================
    // NCERT
    // ==========================
    if (
        q.includes("ncert") ||
        q.includes("std") ||
        q.includes("class") ||
        q.includes("grade") ||
        q.includes("chapter") ||
        q.includes("textbook") ||
        q.includes("math") ||
        q.includes("maths") ||
        q.includes("science") ||
        q.includes("physics") ||
        q.includes("chemistry") ||
        q.includes("biology") ||
        q.includes("english") ||
        q.includes("hindi")
    ) {
        return "NCERT";
    }

    // ==========================
    // GCERT
    // ==========================
    if (
        q.includes("gcert") ||
        q.includes("gujarat textbook") ||
        q.includes("gujarati medium")
    ) {
        return "GCERT";
    }

    // ==========================
    // CBSE
    // ==========================
    if (
        q.includes("cbse")
    ) {
        return "CBSE";
    }

    // ==========================
    // GSEB
    // ==========================
    if (
        q.includes("gseb")
    ) {
        return "GSEB";
    }

    // ==========================
    // DIKSHA
    // ==========================
    if (
        q.includes("diksha")
    ) {
        return "DIKSHA";
    }

    // ==========================
    // Circular
    // ==========================
    if (
        q.includes("circular") ||
        q.includes("પરિપત્ર")
    ) {
        return "CIRCULAR";
    }

    // ==========================
    // GR
    // ==========================
    if (
        q.includes("gr") ||
        q.includes("resolution") ||
        q.includes("ઠરાવ")
    ) {
        return "GR";
    }

    return null;

}