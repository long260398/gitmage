import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './prompt';
import { Config } from './config';

const MAX_DIFF_CHARS = 8000;

export async function generateMessage(diff: string, config: Config): Promise<string> {
  const truncated =
    diff.length > MAX_DIFF_CHARS
      ? diff.slice(0, MAX_DIFF_CHARS) + '\n\n[diff truncated]'
      : diff;

  const userMessage = `Generate a commit message for this diff:\n\n${truncated}`;

  if (config.provider === 'groq') {
    return generateWithGroq(userMessage, config.apiKey);
  }

  return generateWithClaude(userMessage, config.apiKey);
}

async function generateWithGroq(userMessage: string, apiKey: string): Promise<string> {
  const client = new Groq({ apiKey });

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 100,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from Groq API');
  }

  return text.trim();
}

async function generateWithClaude(userMessage: string, apiKey: string): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  return block.text.trim();
}
