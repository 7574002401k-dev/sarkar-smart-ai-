import officialLinks from "../data/official-links.json" with { type: "json" };

export async function searchNCERT(query) {

    return `
📚 NCERT OFFICIAL RESOURCES

❓ Your Question:
${query}

━━━━━━━━━━━━━━━━━━━━━━

🌐 Official NCERT Website
${officialLinks.ncert.website}

📘 NCERT Textbooks
${officialLinks.ncert.books}

━━━━━━━━━━━━━━━━━━━━━━

🤖 Sarkar Smart AI

You can also ask:

✅ Explain this chapter
✅ Find PDF
✅ Notes
✅ MCQ
✅ Important Questions
✅ Question Answers
✅ Summary

━━━━━━━━━━━━━━━━━━━━━━

⚠️ All educational resources are provided from the Official NCERT Website.

Created by Sarkar Smart AI
`;

}