'use server';

/**
 * @fileOverview A flow to summarize consultation chat history for consultants.
 * 
 * - summarizeConsultationChat - A function that summarizes the chat history.
 * - SummarizeConsultationChatInput - The input type for the summarizeConsultationChat function.
 * - SummarizeConsultationChatOutput - The return type for the summarizeConsultationChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConsultationChatInputSchema = z.object({
  chatHistory: z
    .string()
    .describe('The complete chat history between the student and consultant.'),
});
export type SummarizeConsultationChatInput = z.infer<
  typeof SummarizeConsultationChatInputSchema
>;

const SummarizeConsultationChatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the consultation chat.'),
});
export type SummarizeConsultationChatOutput = z.infer<
  typeof SummarizeConsultationChatOutputSchema
>;

export async function summarizeConsultationChat(
  input: SummarizeConsultationChatInput
): Promise<SummarizeConsultationChatOutput> {
  return summarizeConsultationChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConsultationChatPrompt',
  input: {schema: SummarizeConsultationChatInputSchema},
  output: {schema: SummarizeConsultationChatOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing a conversation between a student and a consultant.\n\n  Please provide a concise and informative summary of the chat history provided below:\n\n  Chat History:\n  {{chatHistory}}\n\n  Summary: `,
});

const summarizeConsultationChatFlow = ai.defineFlow(
  {
    name: 'summarizeConsultationChatFlow',
    inputSchema: SummarizeConsultationChatInputSchema,
    outputSchema: SummarizeConsultationChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
