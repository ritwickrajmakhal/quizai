const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const prompt = async (text) => {
  const MODEL_NAME = "gemini-pro";
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      {
        text: text,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response.text().toString();
    console.log(response);
    // Find index positions of '[' and ']'
    const startIndex = response.indexOf("[");
    const endIndex = response.lastIndexOf("]");
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = response.substring(startIndex, endIndex + 1);
      try {
        const jsonObject = JSON.parse(jsonString); // Parse JSON block to JavaScript object
        return jsonObject; // return the parsed object
      } catch (error) {
        console.log("Error parsing JSON:", error);
        return null;
      }
    } else {
      console.log("No JSON block found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
};

module.exports = prompt;
