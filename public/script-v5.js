// ======================================================
// SARKAR SMART AI V5
// PART 1 - VARIABLES & NAVIGATION
// ======================================================

// ---------- Main Sections ----------

const container = document.querySelector(".container");

const cameraSection = document.getElementById("cameraSection");

const pdfSection = document.getElementById("pdfSection");

const imageGenerator = document.getElementById("imageGenerator");

const quizSection = document.getElementById("quizSection");

const historyPanel = document.getElementById("historyPanel");

// ---------- Sidebar ----------

const sidebar = document.getElementById("sidebar");

const menuBtn = document.getElementById("menuBtn");

const closeBtn = document.getElementById("closeBtn");

// ---------- Sidebar Buttons ----------

const chatBtn = document.getElementById("chatBtn");

const cameraBtn = document.getElementById("cameraBtn");

const pdfBtn = document.getElementById("pdfBtn");

const imageCreatorBtn = document.getElementById("imageCreatorBtn");

const quizBtn = document.getElementById("quizBtn");

const historyBtn = document.getElementById("historyBtn");

// ======================================================
// SHOW SECTION
// ======================================================

function showSection(section){

    // Hide All

    if(container)
        container.style.display="none";

    if(cameraSection)
        cameraSection.style.display="none";

    if(pdfSection)
        pdfSection.style.display="none";

    if(imageGenerator)
        imageGenerator.style.display="none";

    if(quizSection)
        quizSection.style.display="none";

    if(historyPanel)
        historyPanel.classList.remove("active");



    // Show Selected

    switch(section){

        case "chat":

            container.style.display="flex";

        break;



        case "camera":

            cameraSection.style.display="block";

        break;



        case "pdf":

            pdfSection.style.display="block";

        break;



        case "image":

            imageGenerator.style.display="block";

        break;



        case "quiz":

            quizSection.style.display="block";

        break;



        case "history":

            historyPanel.classList.add("active");

        break;

    }



    sidebar.classList.remove("active");

}



// ======================================================
// SIDEBAR
// ======================================================

if(menuBtn){

    menuBtn.onclick=()=>{

        sidebar.classList.add("active");

    };

}


if(closeBtn){

    closeBtn.onclick=()=>{

        sidebar.classList.remove("active");

    };

}



// ======================================================
// NAVIGATION
// ======================================================

if(chatBtn){

    chatBtn.onclick=()=>{

        console.log("Chat");

        showSection("chat");

    };

}



if(cameraBtn){

    cameraBtn.onclick=()=>{

        console.log("Camera");

        showSection("camera");

    };

}



if(pdfBtn){

    pdfBtn.onclick=()=>{

        console.log("PDF");

        showSection("pdf");

    };

}



if(imageCreatorBtn){

    imageCreatorBtn.onclick=()=>{

        console.log("Image");

        showSection("image");

    };

}



if(quizBtn){

    quizBtn.onclick=()=>{

        console.log("Quiz");

        showSection("quiz");

    };

}



if(historyBtn){

    historyBtn.onclick=()=>{

        console.log("History");

        showSection("history");

    };

}// ======================================================
// AI CAMERA MODULE
// ======================================================

// ---------- Elements ----------

const openCameraBtn = document.getElementById("openCameraBtn");

const switchCameraBtn = document.getElementById("switchCameraBtn");

const captureBtn = document.getElementById("captureBtn");

const analyzeImageBtn = document.getElementById("analyzeImageBtn");

const closeCameraBtn = document.getElementById("closeCameraBtn");

const cameraVideo = document.getElementById("cameraVideo");

const cameraCanvas = document.getElementById("cameraCanvas");

const capturedImage = document.getElementById("capturedImage");

const cameraPrompt = document.getElementById("cameraPrompt");

const cameraResult = document.getElementById("cameraResult");

const featureButtons =
document.querySelectorAll(".ai-feature");


// ---------- Variables ----------

let cameraStream = null;

let facingMode = "environment";

let selectedFeature = "lens";


// ======================================================
// FEATURE SELECT
// ======================================================

featureButtons.forEach(button=>{

    button.onclick=()=>{

        featureButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedFeature=
        button.dataset.feature;

        console.log(selectedFeature);

    };

});


// ======================================================
// OPEN CAMERA
// ======================================================

async function startCamera(){

    try{

        if(cameraStream){

            cameraStream.getTracks().forEach(track=>track.stop());

        }

        cameraStream=
        await navigator.mediaDevices.getUserMedia({

            video:{

                facingMode:facingMode

            }

        });

        cameraVideo.srcObject=cameraStream;

    }

    catch(err){

        console.error(err);

        alert("Camera permission denied.");

    }

}



// ======================================================
// BUTTONS
// ======================================================

if(openCameraBtn){

    openCameraBtn.onclick=()=>{

        startCamera();

    };

}



if(switchCameraBtn){

    switchCameraBtn.onclick=()=>{

        facingMode=
        facingMode==="environment"
        ?"user"
        :"environment";

        startCamera();

    };

}



// ======================================================
// CAPTURE
// ======================================================

if(captureBtn){

    captureBtn.onclick=()=>{

        cameraCanvas.width=
        cameraVideo.videoWidth;

        cameraCanvas.height=
        cameraVideo.videoHeight;

        const ctx=
        cameraCanvas.getContext("2d");

        ctx.drawImage(

            cameraVideo,

            0,

            0

        );

        capturedImage.src=
        cameraCanvas.toDataURL("image/png");

        capturedImage.style.display="block";

    };

}



// ======================================================
// ANALYZE
// ======================================================

if(analyzeImageBtn){

    analyzeImageBtn.onclick=async()=>{

        if(!capturedImage.src){

            alert("Capture image first.");

            return;

        }

        cameraResult.innerHTML=
        "🤖 AI is analyzing...";

        try{

            const response=
            await fetch("/analyze-image",{

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    image:capturedImage.src,

                    prompt:cameraPrompt.value,

                    feature:selectedFeature

                })

            });

            const data=
            await response.json();

            cameraResult.innerHTML=`

<div class="bot-message">

🤖 ${data.reply}

</div>

`;

        }

        catch(err){

            console.error(err);

            cameraResult.innerHTML=
            "❌ Analysis failed.";

        }

    };

}



// ======================================================
// CLOSE CAMERA
// ======================================================

if(closeCameraBtn){

    closeCameraBtn.onclick=()=>{

        if(cameraStream){

            cameraStream.getTracks().forEach(track=>track.stop());

        }

        showSection("chat");

    };

}