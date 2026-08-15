// PDF.js CDN Module
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs';

// Global Worker Options - Prevent 404 Error
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';

console.log("pdf.js:3 PDF MODULE LOADED");

export async function readPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += `--- Page ${pageNum} ---\n` + pageText + "\n\n";
        }

        return fullText;
    } catch (error) {
        console.error("PDF Reading Error:", error);
        throw new Error("PDF વાંચવામાં ભૂલ થઈ છે.");
    }
}