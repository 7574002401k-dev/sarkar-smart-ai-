// Mozilla PDF.js ES Module CDN
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs";

// Worker Config
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs";

/**
 * PDF ફાઈલમાંથી તમામ પેજનો ટેક્સ્ટ વાંચવા માટેનું ફંક્શન
 * @param {File} file - યુઝરે સિલેક્ટ કરેલી PDF ફાઈલ
 * @returns {Promise<string>} - PDF માંથી નીકળેલું આખું લખાણ
 */
export async function readPDF(file) {
    return new Promise((resolve, reject) => {
        if (!file || file.type !== "application/pdf") {
            return reject(new Error("કૃપા કરીને માન્ય PDF ફાઈલ સિલેક્ટ કરો."));
        }

        const reader = new FileReader();

        reader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result);

                // PDF લોડ કરવું
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                const pdf = await loadingTask.promise;

                let extractedText = "";

                // દરેક પેજમાંથી લખાણ વાંચવું
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();

                    const pageText = textContent.items
                        .map((item) => item.str)
                        .join(" ");

                    extractedText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
                }

                if (!extractedText.trim()) {
                    resolve("PDF માંથી કોઈ ટેક્સ્ટ મળ્યો નથી (કદાચ PDF સ્કેન કરેલી ઈમેજ હોઈ શકે છે).");
                } else {
                    resolve(extractedText);
                }

            } catch (error) {
                console.error("PDF Read Error:", error);
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}