document.addEventListener("DOMContentLoaded", () => {
    // Elements Selection
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoModal = document.getElementById("logoModal");
    const closeLogoModal = document.getElementById("closeLogoModal");
    const clickableLogos = document.querySelectorAll(".clickable-logo");

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const messagesContainer = document.getElementById("messagesContainer");

    const plusBtn = document.getElementById("plusBtn");
    const plusMenu = document.getElementById("plusMenu");
    const menuCameraBtn = document.getElementById("menuCameraBtn");
    const menuGalleryBtn = document.getElementById("menuGalleryBtn");
    const menuFileBtn = document.getElementById("menuFileBtn");
    const menuGenBtn = document.getElementById("menuGenBtn");

    const fileInput = document.getElementById("fileInput");
    const galleryInput = document.getElementById("galleryInput");
    const filePreviewBar = document.getElementById("filePreviewBar");
    const previewFileName = document.getElementById("previewFileName");
    const removeFileBtn = document.getElementById("removeFileBtn");

    const micBtn = document.getElementById("micBtn");
    const openMathSolverBtn = document.getElementById("openMathSolverBtn");
    const openPdfReaderBtn = document.getElementById("openPdfReaderBtn");
    const openQuizModalBtn = document.getElementById("openQuizModalBtn");
    const quizModal = document.getElementById("quizModal");
    const closeQuizModalBtn = document.getElementById("closeQuizModalBtn");
    const submitQuizBtn = document.getElementById("submitQuizBtn");

    const cameraModal = document.getElementById("cameraModal");
    const closeCameraModalBtn = document.getElementById("closeCameraModalBtn");
    const webcam = document.getElementById("webcam");
    const cameraCanvas = document.getElementById("cameraCanvas");
    const captureBtn = document.getElementById("captureBtn");
    const switchCameraBtn = document.getElementById("switchCameraBtn");

    let activeStream = null;
    let selectedFile = null;
    let currentFacingMode = "environment";
    
    // 🧠 ચેટ મેમરી
    let conversationHistory = [];

    // 🔊 સ્પીચ વોઈસ લોડર
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // 1. Sidebar Toggle Logic
    function toggleSidebar() {
        if (!sidebar) return;
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle("active");
            if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
        } else {
            sidebar.classList.toggle("closed");
        }
    }

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener("click", toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

    // ➕ નવી ચેટ શરૂ કરવાનો બટન
    const newChatBtn = document.getElementById("newChatBtn") || document.querySelector(".new-chat-btn");
    
    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            conversationHistory = [];

            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="message assistant-message">
                        <div class="message-content">
                            🌟 <b>નમસ્તે! Sarkar Smart AI માં તમારું હાર્દિક સ્વાગત છે!</b><br><br>
                            હું GCERT, NCERT, SSA, CBSE, Gujarat e-Sarkar, PARAKH, SWAYAM, SEBC અને અન્ય સરકારી વિભાગોની સત્તાવાર માહિતી, શૈક્ષણિક પ્રશ્નો, ગણિત સોલ્યુશન અને ફાઈલ એનાલિસિસ માટે તમારો સ્માર્ટ સાથી છું. 🚀<br><br>
                            તમે ગુજરાતી, હિન્દી, સંસ્કૃત કે અંગ્રેજીમાં પ્રશ્ન પૂછી શકો છો!
                        </div>
                    </div>
                `;
            }

            if (userInput) userInput.value = "";
            if (removeFileBtn) removeFileBtn.click();

            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains("active")) {
                toggleSidebar();
            }
        });
    }

    // 2. Logo Zoom Modal
    clickableLogos.forEach(logo => {
        logo.addEventListener("click", () => {
            if (logoModal) logoModal.classList.remove("hidden");
        });
    });
    if (closeLogoModal) {
        closeLogoModal.addEventListener("click", () => logoModal.classList.add("hidden"));
    }

    // 3. Plus Menu Toggle Action
    if (plusBtn) {
        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (plusMenu) plusMenu.classList.toggle("hidden");
        });
    }

    document.addEventListener("click", () => {
        if (plusMenu) plusMenu.classList.add("hidden");
    });

    // 4. File / Image Attachment Selection
    if (menuFileBtn && fileInput) menuFileBtn.addEventListener("click", () => fileInput.click());
    if (menuGalleryBtn && galleryInput) menuGalleryBtn.addEventListener("click", () => galleryInput.click());
    if (openPdfReaderBtn && fileInput) openPdfReaderBtn.addEventListener("click", () => fileInput.click());

    if (fileInput) fileInput.addEventListener("change", handleFileSelection);
    if (galleryInput) galleryInput.addEventListener("change", handleFileSelection);

    function handleFileSelection(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            if (previewFileName) previewFileName.textContent = `📎 પસંદ કરેલી ફાઈલ: ${selectedFile.name}`;
            if (filePreviewBar) filePreviewBar.classList.remove("hidden");
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener("click", () => {
            selectedFile = null;
            if (fileInput) fileInput.value = "";
            if (galleryInput) galleryInput.value = "";
            if (filePreviewBar) filePreviewBar.classList.add("hidden");
        });
    }

    // 5. Camera & Scanner Operations
    async function startCamera() {
        try {
            if (cameraCanvas) {
                const ctx = cameraCanvas.getContext("2d");
                ctx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
                cameraCanvas.style.display = "none";
            }

            if (webcam) {
                webcam.style.display = "block";
            }

            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
            activeStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode }
            });
            if (webcam) webcam.srcObject = activeStream;
            if (cameraModal) cameraModal.classList.remove("hidden");
        } catch (err) {
            alert("⚠️ કેમેરાનો એક્સેસ મળી શક્યો નથી. પરમિશન ચકાસો.");
        }
    }

    function stopCamera() {
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }
        if (cameraModal) cameraModal.classList.add("hidden");
    }

    if (menuCameraBtn) menuCameraBtn.addEventListener("click", startCamera);
    if (openMathSolverBtn) openMathSolverBtn.addEventListener("click", startCamera);
    if (closeCameraModalBtn) closeCameraModalBtn.addEventListener("click", stopCamera);

    if (switchCameraBtn) {
        switchCameraBtn.addEventListener("click", () => {
            currentFacingMode = (currentFacingMode === "user") ? "environment" : "user";
            startCamera();
        });
    }

    if (captureBtn) {
        captureBtn.addEventListener("click", () => {
            if (!cameraCanvas || !webcam) return;
            const ctx = cameraCanvas.getContext("2d");
            cameraCanvas.width = webcam.videoWidth;
            cameraCanvas.height = webcam.videoHeight;
            ctx.drawImage(webcam, 0, 0);

            webcam.style.display = "none";
            cameraCanvas.style.display = "block";

            cameraCanvas.toBlob(blob => {
                selectedFile = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                if (previewFileName) previewFileName.textContent = `📷 ફોટો પસંદ થઈ ગયો છે`;
                if (filePreviewBar) filePreviewBar.classList.remove("hidden");
                stopCamera();
            }, "image/jpeg");
        });
    }

    // 6. Voice Input (Speech Recognition)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'gu-IN';

        if (micBtn) {
            micBtn.addEventListener("click", () => {
                recognition.start();
                micBtn.style.color = "#ff4d4d";
            });
        }

        recognition.onresult = (e) => {
            if (userInput) userInput.value = e.results[0][0].transcript;
            if (micBtn) micBtn.style.color = "var(--accent-color)";
        };

        recognition.onerror = () => { if (micBtn) micBtn.style.color = "var(--accent-color)"; };
        recognition.onend = () => { if (micBtn) micBtn.style.color = "var(--accent-color)"; };
    }

    // 7. Image/Poster Prompt Shortcut
    if (menuGenBtn) {
        menuGenBtn.addEventListener("click", () => {
            if (userInput) {
                userInput.value = "એક મોટિવેશનલ કે ફેસ્ટિવલ પોસ્ટર જનરેટ કરી આપો: ";
                userInput.focus();
            }
        });
    }

    // 8. Quiz Generation Modal Handlers
    if (openQuizModalBtn) openQuizModalBtn.addEventListener("click", () => quizModal.classList.remove("hidden"));
    if (closeQuizModalBtn) closeQuizModalBtn.addEventListener("click", () => quizModal.classList.add("hidden"));

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener("click", async () => {
            const std = document.getElementById("quizStd")?.value || "General";
            const subject = document.getElementById("quizSubject")?.value || "GK";
            const chapter = document.getElementById("quizChapter")?.value || "General";
            const marks = document.getElementById("quizMarks")?.value || 5;

            const types = [];
            if (document.getElementById("typeMcq")?.checked) types.push("MCQ");
            if (document.getElementById("typeBlank")?.checked) types.push("ખાલી જગ્યા");
            if (document.getElementById("typeShort")?.checked) types.push("ટૂંકા પ્રશ્નો");
            if (document.getElementById("typeLong")?.checked) types.push("લાંબા પ્રશ્નો");

            if (quizModal) quizModal.classList.add("hidden");
            appendMessage(`📝 ક્વિઝ રિક્વેસ્ટ: ધોરણ ${std} | વિષય ${subject} | પ્રકરણ ${chapter} (${marks} ગુણ)`, "user-message");

            try {
                const res = await fetch("/api/generate-quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ std, subject, chapter, totalMarks: marks, questionTypes: types })
                });
                const data = await res.json();
                appendMessage(data.reply, "assistant-message");
            } catch (err) {
                appendMessage("⚠️ ક્વિઝ જનરેટ કરવામાં તકલીફ થઈ છે. [Source: AI Generated]", "assistant-message");
            }
        });
    }

    // 9. Main Form Handler
    if (chatForm) {
        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = userInput ? userInput.value.trim() : "";
            if (!text && !selectedFile) return;

            let userMsgText = text;
            if (selectedFile) {
                userMsgText = `[ફાઈલ: ${selectedFile.name}] ${text}`;
            }

            appendMessage(userMsgText, "user-message");
            if (userInput) userInput.value = "";

            const lowerText = text.toLowerCase();
            
            const isImageFile = selectedFile && selectedFile.type.startsWith("image/");
            const isPdfFile = selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"));
            
            const isImageGenKeyword = lowerText.includes("પોસ્ટર જનરેટ") || lowerText.includes("ઈમેજ બનાવો") || lowerText.includes("પોસ્ટર બનાવો") || lowerText.includes("ફોટો જનરેટ");

            // 🟢 A. Vision AI (Image Analysis)
            if (isImageFile && !isImageGenKeyword) {
                const loadingDiv = appendMessage("🔄 ફોટો વિશ્લેષિત થઈ રહ્યો છે...", "assistant-message");
                const reader = new FileReader();

                reader.onload = async () => {
                    try {
                        const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: text || "આ ફોટા વિશે સમજાવો.",
                                imageBase64: reader.result,
                                history: conversationHistory
                            })
                        });

                        const data = await res.json();
                        if (loadingDiv) loadingDiv.remove();
                        const replyText = data.reply || "⚠️ વિશ્લેષણમાં ભૂલ થઈ. [Source: AI Generated]";
                        appendMessage(replyText, "assistant-message");

                        conversationHistory.push({ role: "user", parts: [{ text: `[અપલોડ કરેલો ફોટો]: ${text}` }] });
                        conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                    } catch (err) {
                        if (loadingDiv) loadingDiv.remove();
                        appendMessage("⚠️ સર્વર પ્રોસેસિંગમાં તકલીફ થઈ. [Source: AI Generated]", "assistant-message");
                    }
                };
                reader.readAsDataURL(selectedFile);
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            // 🎨 B. Image Generation Logic
            if (isImageGenKeyword) {
                const loadingDiv = appendMessage("🔄 HD ઈમેજ/પોસ્ટર પ્રોસેસ થઈ રહ્યું છે...", "assistant-message");

                try {
                    const res = await fetch("/api/generate-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: text })
                    });

                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();

                    if (data.imageUrl) {
                        appendMessage(`✨ ${data.reply || "તમારું પોસ્ટર તૈયાર છે:"}<br><img src="${data.imageUrl}" style="max-width:100%; border-radius:12px; margin-top:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"><div class="message-source-note" style="font-size: 11px; opacity: 0.85; margin-top: 10px; border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 6px;">🌐 <b>Source:</b> [Source: Open-Source AI Models]</div>`, "assistant-message");
                    } else {
                        appendMessage(data.reply || "⚠️ ઈમેજ જનરેટ થઈ શકી નથી.", "assistant-message");
                    }
                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage("⚠️ ઈમેજ પ્રોસેસ કરવામાં ભૂલ થઈ. [Source: AI Generated]", "assistant-message");
                }
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            // 📄 C. Document & PDF Analysis
            if (selectedFile && isPdfFile) {
                const loadingDiv = appendMessage("🔄 ફાઈલનું વિશ્લેષણ થઈ રહ્યું છે...", "assistant-message");
                
                const formData = new FormData();
                formData.append("pdfFile", selectedFile);
                formData.append("comment", text || "આ ફાઈલનું પૃથ્થકરણ કરો.");

                try {
                    const res = await fetch("/api/analyze-pdf", {
                        method: "POST",
                        body: formData
                    });
                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();

                    const replyText = data.reply || "⚠️ ફાઈલ વિશ્લેષણમાં ભૂલ થઈ. [Source: AI Generated]";
                    appendMessage(replyText, "assistant-message");

                    conversationHistory.push({ role: "user", parts: [{ text: `[અપલોડ કરેલી ફાઈલ: ${selectedFile.name}] ${text}` }] });
                    conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage("⚠️ ફાઈલ પ્રોસેસ કરવામાં ભૂલ થઈ. [Source: AI Generated]", "assistant-message");
                }
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            // 💬 D. Standard Text Chat Operations
            try {
                conversationHistory.push({ role: "user", parts: [{ text: text }] });

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        message: text,
                        history: conversationHistory 
                    })
                });

                const data = await response.json();
                const replyText = data.reply || "જવાબ મળી રહ્યો છે...";

                conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                appendMessage(replyText, "assistant-message");
            } catch (error) {
                appendMessage("⚠️ સર્વર સાથે સંપર્ક થઈ શક્યો નથી. [Source: AI Generated]", "assistant-message");
            }
        });
    }

    // 🎯 Message Renderer with Markdown Link & Short-Form Official Source Formatting
    function appendMessage(text, className) {
        if (!messagesContainer) return null;
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${className}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";

        let cleanHtmlText = text
            .replace(/###\s?/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '');

        // Convert Markdown links [Text](URL) into clickable HTML links
        cleanHtmlText = cleanHtmlText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline; font-weight: 500;">$1</a>');

        cleanHtmlText = cleanHtmlText.replace(/\n/g, "<br>");

        contentDiv.innerHTML = cleanHtmlText;

        const isAssistant = className.includes("assistant-message");
        const isLoadingMsg = text.includes("🔄");

        if (isAssistant && !isLoadingMsg) {
            // Audio Readout Button
            const audioContainer = document.createElement("div");
            audioContainer.style.marginTop = "10px";

            const audioBtn = document.createElement("button");
            audioBtn.className = "chat-audio-btn";
            audioBtn.style.cssText = "display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 8px; color: inherit; cursor: pointer; font-size: 12px;";
            audioBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
            audioBtn.onclick = () => toggleSpeech(text, audioBtn);
            
            audioContainer.appendChild(audioBtn);
            contentDiv.appendChild(audioContainer);
        }

        msgDiv.appendChild(contentDiv);
        messagesContainer.appendChild(msgDiv);
        
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);

        return msgDiv;
    }

    // Voice Synthesis Logic
    function toggleSpeech(text, btnElement) {
        if (!('speechSynthesis' in window)) {
            alert("તમારા બ્રાઉઝરમાં અવાજ પ્લે કરવાની સુવિધા નથી.");
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
            return;
        }

        let cleanText = text
            .replace(/#/g, '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/[*_~`]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);

        const containsGujarati = /[\u0A80-\u0AFF]/.test(cleanText);
        const containsHindi = /[\u0900-\u097F]/.test(cleanText);

        if (containsGujarati) {
            utterance.lang = 'gu-IN';
        } else if (containsHindi) {
            utterance.lang = 'hi-IN';
        } else {
            utterance.lang = 'en-US';
        }

        const voices = window.speechSynthesis.getVoices();
        const targetLang = utterance.lang.split('-')[0];
        const matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            btnElement.innerHTML = `<i class="fa-solid fa-square-stop"></i> અટકાવો`;
        };

        utterance.onend = () => {
            btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
        };

        utterance.onerror = () => {
            btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
        };

        window.speechSynthesis.speak(utterance);
    }
});

// Sidebar History Loader
function loadHistoryChat(topic) {
    const userInput = document.getElementById("userInput");
    if (userInput) {
        userInput.value = `મને આ ચેટ વિશે આગળ સમજાવો: ${topic}`;
        userInput.focus();
    }
}