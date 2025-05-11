// src/lib/intent.ts
import OpenAI from 'openai';
const openai = new OpenAI();

export async function intentFromPrompt(prompt: string) {
  const funcSchema = {
    name: 'classifyGoal',
    description: 'Classify an investing prompt into clean tags',
    parameters: {
      type: 'object',
      properties: {
        goal: { type: 'string' },        // income | growth | balanced | ...
        horizon: { type: 'string' },     // short | medium | long
        volatility: { type: 'string' },  // low | med | high
      },
      required: ['goal'],
    },
  };

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    functions: [funcSchema],
    function_call: { name: 'classifyGoal' },
  });
  const args = JSON.parse(res.choices[0].message.function_call!.arguments);
  return args as { goal: string; horizon?: string; volatility?: string };
}
