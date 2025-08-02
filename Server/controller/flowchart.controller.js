import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
export const flowChartHandler = async (req, res) => {
  let { file } = req.body;
  file = JSON.parse(file);
  // console.log("FILE : " , file)
  try {
    const response= await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Convert my git folder tree into beautiful Mermaid flowchart code. Create a visually appealing diagram with:
Structure Requirements:
* Use Mermaid flowchart syntax (flowchart TD or flowchart LR)
* Represent folders as rectangles/rounded rectangles
* Show files as different shapes (ovals, diamonds, etc.)
* Create clear parent-child relationships with arrows
Visual Styling:
* Apply custom CSS styling with classDefs for different node types
* Use attractive colors (gradients if possible)
* Different colors for folders vs files vs config files
* Modern color palette (blues, purples, greens, or your preference)
* Clean, readable fonts
Node Types to Style:
* Root folder (special styling)
* Regular folders
* Source code files (.js, .py, .java, etc.)
* Config files (.json, .yml, .env, etc.)
* Documentation files (.md, .txt, etc.)
* Git files (.gitignore, etc.)
Example styling format:
My git folder structure is: ${file}
Please generate the complete Mermaid code including both the flowchart structure and all the styling definitions to make it look professional and attractive No explanations also not add any comment in the Code, just the code..`,
    });

    const result = `${(response.candidates[0].content.parts[0].text).replaceAll("```" , "").replace("mermaid\n" , "")}`;
    console.log("RES : ", result);

    return res.status(200).send({
      message: "Code Recieved",
      result,
    });
  } catch (error) {
      console.log("Error : ", error)
      return res.status(500).send({
        message:"Internal Server Error"
    })
  }
};
