import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { buildSystemPrompt } from './prompt';
import { Config } from './config';

const MAX_DIFF_CHARS = 8000;

export async function generateMessages(diff: string, config: Config): Promise<string[]> {
  const truncated =
    diff.length > MAX_DIFF_CHARS
      ? diff.slice(0, MAX_DIFF_CHARS) + '\n\n[diff truncated]'
      : diff;

  const userMessage = `Generate 3 commit message options for this diff:\n\n${truncated}`;
  const systemPrompt = buildSystemPrompt(config.language);

  const raw =
    config.provider === 'groq'
      ? await callGroq(userMessage, systemPrompt, config.apiKey)
      : await callClaude(userMessage, systemPrompt, config.apiKey);

  const messages = raw
    .split('\n')
    .map((line) => line.replace(/^\d+[\.\)\-\s]+/, '').trim())
    .filter((line) => line.length > 5)
    .slice(0, 3);

  if (messages.length === 0) throw new Error('AI returned no valid commit messages');

  return messages;
}

async function callGroq(
  userMessage: string,
  system: string,
  apiKey: string,
): Promise<string> {
  const client = new Groq({ apiKey });
  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 250,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userMessage },
    ],
  });
  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq API');
  return text.trim();
}

async function callClaude(
  userMessage: string,
  system: string,
  apiKey: string,
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    system,
    messages: [{ role: 'user', content: userMessage }],
  });
  const block = res.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude API');
  return block.text.trim();
}
