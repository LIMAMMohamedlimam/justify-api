import { Router, Request, Response } from "express";
import { authenticateToken, checkRateLimit } from "../middleware.js";

import { validateText } from "../../utils/textvalidator.js";


export const justifyRouter = Router();




justifyRouter.post("/", authenticateToken, checkRateLimit,  (req: Request, res: Response) => {

    // Validate and sanitize input
    const { success, data , error } = validateText(req.body);
    if (!success) {
        return res.status(400).json({ error: error.errors ? error.errors.map((e:any) => e.message) : 'Invalid input' });
    }
    const text = data as string;
    // Verification du limite d'usage

    // Justifcation du texte
    const words = text.split(/\s+/).filter(Boolean);
    const justifiedText = justifyText(words , 80).join("\n"); 
    res.json({ justifiedText });
});







/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */

// Justify text to a given width
export function justifyText (words : string[], maxWidth:number) {
    const result = [];
    let line : string[] = [];
    let lineLength = 0;

    // Build lines of words
    for (const word of words) {
        if (lineLength + line.length + word.length <= maxWidth) {
            line.push(word);
            lineLength += word.length;
        } else {
            result.push(line);
            line = [word];
            lineLength = word.length;
        }
    }

    // Push the last line
    result.push(line);

    // Justify all lines except the last one
    const justifiedLines = [];
    for (let i = 0; i < result.length - 1; i++) {
        line = result[i];
        const numWords = line.length;
        const numSpaces = maxWidth - line.reduce((acc, word) => acc + word.length, 0);

        let spaceGaps = Math.max(numWords - 1, 1);
        const spacesPerGap = Math.floor(numSpaces / spaceGaps);
        let extraSpaces = numSpaces % spaceGaps;

        let justifiedLine = "";
        for (const word of line) {
            justifiedLine += word;

            if (spaceGaps > 0) {
                const spacesToAdd = spacesPerGap + (extraSpaces > 0 ? 1 : 0);
                justifiedLine += " ".repeat(spacesToAdd);
                extraSpaces -= 1;
                spaceGaps -= 1;
            }
        }

        // Remove trailing spaces if any
        justifiedLines.push(justifiedLine);
    }

    // Handle the last line (left-justified)
    const lastLine = result[result.length - 1].join(" ");
    justifiedLines.push(lastLine + " ".repeat(maxWidth - lastLine.length));

    return justifiedLines;    
};