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