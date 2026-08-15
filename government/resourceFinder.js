import { detectEducationSource } from "./educationDetector.js";

export function findResource(query){

    const q = query.toLowerCase();

    const education = detectEducationSource(query);

    if(education==="NCERT") return "NCERT";

    if(education==="GCERT") return "GCERT";

    if(education==="GSEB") return "GSEB";

    if(
        q.includes("diksha")
    ){
        return "DIKSHA";
    }

    if(
        q.includes("circular") ||
        q.includes("પરિપત્ર")
    ){
        return "CIRCULAR";
    }

    if(
        q.includes("gr") ||
        q.includes("resolution") ||
        q.includes("ઠરાવ")
    ){
        return "GR";
    }

    if(
        q.includes("news") ||
        q.includes("સમાચાર")
    ){
        return "NEWS";
    }

    return null;

}