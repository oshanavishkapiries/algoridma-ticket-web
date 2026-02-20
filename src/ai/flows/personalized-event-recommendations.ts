'use server';
/**
 * @fileOverview An AI agent that recommends university events to users based on their past activity and preferences.
 *
 * - recommendEvents - A function that handles the event recommendation process.
 * - PersonalizedEventRecommendationsInput - The input type for the recommendEvents function.
 * - PersonalizedEventRecommendationsOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userId: z.string().describe('The unique identifier for the user.'),
  pastPurchases: z
    .array(z.string())
    .optional()
    .describe('A list of events the user has previously purchased tickets for.'),
  preferences: z
    .array(z.string())
    .optional()
    .describe('A list of stated preferences or interests from the user profile.'),
  upcomingEvents: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        date: z.string(),
        category: z.string(),
        description: z.string(),
      })
    )
    .describe('A list of all available upcoming events with their details.'),
});
export type PersonalizedEventRecommendationsInput = z.infer<
  typeof PersonalizedEventRecommendationsInputSchema
>;

const RecommendedEventSchema = z.object({
  id: z.string().describe('The unique identifier of the recommended event.'),
  name: z.string().describe('The name of the recommended event.'),
  date: z.string().describe('The date of the recommended event.'),
  category: z.string().describe('The category of the recommended event.'),
  description: z
    .string()
    .describe('A brief description of the recommended event.'),
  reason: z
    .string()
    .describe('A short explanation why this event is recommended to the user.'),
});

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(RecommendedEventSchema)
    .describe('A list of recommended events for the user.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<
  typeof PersonalizedEventRecommendationsOutputSchema
>;

export async function recommendEvents(
  input: PersonalizedEventRecommendationsInput
): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in recommending university events.
Your goal is to suggest relevant upcoming events to a user based on their past activity and preferences.

User ID: {{{userId}}}

{{#if pastPurchases}}
Past ticket purchases: {{{pastPurchases}}}.
{{else}}
No past purchases available.
{{/if}}

{{#if preferences}}
User preferences: {{{preferences}}}.
{{else}}
No specific preferences provided.
{{/if}}

Available upcoming events:
{{#each upcomingEvents}}
- ID: {{this.id}}, Name: {{this.name}}, Date: {{this.date}}, Category: {{this.category}}, Description: {{this.description}}
{{/each}}

Based on the user's past purchases and preferences, and from the list of upcoming events, recommend up to 5 events that the user is most likely to be interested in.
For each recommendation, provide a brief reason why it is recommended, focusing on the user's explicit or implicit interests. Only recommend events from the 'Available upcoming events' list.
`,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
