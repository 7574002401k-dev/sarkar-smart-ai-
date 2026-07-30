import fs from "fs";

const memoryFile = "./chat_memory.json";


// Load Memory
function loadMemory(){

    if(!fs.existsSync(memoryFile)){

        fs.writeFileSync(
            memoryFile,
            JSON.stringify({})
        );

    }


    const data = fs.readFileSync(
        memoryFile,
        "utf-8"
    );


    return JSON.parse(data);

}



// Save Memory

function saveMemory(data){

    fs.writeFileSync(

        memoryFile,

        JSON.stringify(data, null, 2)

    );

}




// Get Memory

export function getMemory(userId="default"){


    const memory = loadMemory();



    if(!memory[userId]){

        memory[userId] = [];

    }



    return memory[userId];


}





// Add Memory

export function addMemory(

    userId="default",

    role,

    content

){


    const memory = loadMemory();



    if(!memory[userId]){

        memory[userId] = [];

    }




    memory[userId].push({

        role: role,

        content: content,

        time: new Date().toISOString()

    });





    // Keep last 20 messages

    if(memory[userId].length > 20){


        memory[userId] = memory[userId].slice(-20);


    }





    saveMemory(memory);



    // Check Memory in Terminal

    console.log(
        "🧠 Sarkar Smart AI Memory:",
        memory[userId]
    );


}