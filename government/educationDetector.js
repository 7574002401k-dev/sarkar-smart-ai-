export function isEducationQuery(query) {

    const q = query.toLowerCase();

    const keywords = [

        "std",
        "class",
        "grade",

        "ncert",
        "gcert",
        "cbse",
        "gseb",

        "math",
        "maths",
        "science",
        "english",
        "hindi",
        "gujarati",
        "biology",
        "physics",
        "chemistry",
        "sst",
        "social science",
        "computer",

        "chapter",
        "exercise",
        "lesson",
        "textbook",
        "book",

        "mcq",
        "quiz",
        "notes",
        "worksheet",
        "question",
        "answer",

        "exam",
        "sample paper",
        "important question"

    ];

    return keywords.some(word => q.includes(word));

}


export function detectEducationSource(query){

    const q = query.toLowerCase();

    if(
        q.includes("ncert") ||
        q.includes("cbse")
    ){
        return "NCERT";
    }

    if(
        q.includes("gcert") ||
        q.includes("gujarat textbook")
    ){
        return "GCERT";
    }

    if(
        q.includes("gseb") ||
        q.includes("gujarat board")
    ){
        return "GSEB";
    }

    if(isEducationQuery(query)){
        return "EDUCATION";
    }

    return "GENERAL";

}