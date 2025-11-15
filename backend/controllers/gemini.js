import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
const main = async (prompt) => {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }
    
    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const htmlContent = marked.parse(text);
    
    return htmlContent;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
export default main