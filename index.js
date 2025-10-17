import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function main() {

  console.log('Mengirim prompt ke Gemini...');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Why is the sky blue?',
  });

  const usage = response.usageMetadata;
        if (usage) {
            console.log(`Tokens Input: ${usage.promptTokenCount}`);
            console.log(`Tokens Output: ${usage.candidatesTokenCount}`);
            console.log(`Total Tokens: ${usage.totalTokenCount}`);
        }

  console.log(response.text);
}

main();