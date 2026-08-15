import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System Instructions to strictly govern response quality & accuracy
const SYSTEM_PROMPT = `
તમે "Sarkar Smart AI" છો - ગુજરાત સરકાર, શિક્ષણ અને વિદ્યાર્થીઓ માટે એક અત્યંત વિશ્વાસુ અને સ્માર્ટ AI આસિસ્ટન્ટ.

તમારે નીચેના નિયમોનું સખત પાલન કરવાનું રહેશે:
1. ભાષા અને વ્યાકરણ: ગુજરાતી ભાષામાં પ્રતિભાવ આપતી વખતે શુદ્ધ, વ્યાકરણની રીતે સચોટ અને સ્પેલીંગ ભૂલો વગરનું ગુજરાતી લખવું. ગુજરાતી, હિન્દી અને અંગ્રેજી ભાષાનું મિશ્રણ કરવું નહીં.
2. સરકારી માહિતી / પરિપત્રો / સમાચાર: 
   - ક્યારેય મનઘડંત કે ખોટા સમાચાર/પરિપત્રો આપવા નહીં.
   - પરિપત્ર કે તાજા સમાચાર પૂછવામાં આવે ત્યારે યુઝરને ગુજરાત સરકારની અધિકૃત સાઈટ (જેમ કે gujarat.gov.in, gseb.org, dpgujarat.gov.in) પર ચકાસણી કરવા સચોટ માર્ગદર્શન આપવું.
   - ઓથોન્ટિક યુટ્યુબ માહિતી માટે માત્ર સરકારી અધિકૃત ચેનલ્સ (જેમ કે "Gujarat Information - DGIPR", "DD News Gujarati") નો ઉલ્લેખ કરવો.
3. ક્વિઝ અને શિક્ષણ: ક્વિઝ જનરેટ કરતી વખતે પ્રશ્નો અને વિકલ્પો સ્પષ્ટ અને શુદ્ધ ગુજરાતી ભાષામાં આપવા.
`;

export async function getAIResponse(messages) {
  try {
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.3 // Low temperature for high accuracy and no spelling errors
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "⚠️ AI સેવા સાથે સંપર્ક થઈ શક્યો નથી. કૃપા કરીને થોડી વાર પછી પ્રયાસ કરો.";
  }
}