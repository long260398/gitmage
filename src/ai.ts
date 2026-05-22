import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './prompt';

const MAX_DIFF_CHARS = 8000;

export async function generateMessage(diff: string, apiKey: string): Promise<string> {
  const client = new Anthropic({ apiKey });

  // Truncate large diffs to stay within a reasonable token limit
  const truncated =
    diff.length > MAX_DIFF_CHARS
      ? diff.slice(0, MAX_DIFF_CHARS) + '\n\n[diff truncated]'
      : diff;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate a commit message for this diff:\n\n${truncated}`,
      },
    ],
  });

  const block = response.content[0];

  if (block.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  return block.text.trim();
}
