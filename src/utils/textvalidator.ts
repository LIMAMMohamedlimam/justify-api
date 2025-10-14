import { z } from 'zod';
import validator from 'validator';

const textSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(80000, 'Text is too long')
    .transform(val => validator.escape(val.trim()))
});


export function validateText(input: string) : { success: boolean; data?: string; error?: any } {
    try {
        const parsed = textSchema.parse({ text: input });
        return { success: true, data: parsed.text || "" };
    } catch (error) {
        return { success: false, error };
    }
}
