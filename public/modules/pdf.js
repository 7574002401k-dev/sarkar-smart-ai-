import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs";

console.log("PDF MODULE LOADED");

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs";

export async function readPDF(file) {

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    let text = "";

    for (let page = 1; page <= pdf.numPages; page++) {

        const p = await pdf.getPage(page);

        const content = await p.getTextContent();

        text += content.items.map(item => item.str).join(" ");
        text += "\n\n";
    }

    return text;
}