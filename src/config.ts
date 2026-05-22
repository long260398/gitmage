import chalk from 'chalk';

export type Provider = 'groq' | 'claude';

export interface Config {
  provider: Provider;
  apiKey: string;
}

export function getConfig(): Config {
  const groqKey = process.env.GROQ_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;

  if (groqKey) {
    return { provider: 'groq', apiKey: groqKey };
  }

  if (claudeKey) {
    return { provider: 'claude', apiKey: claudeKey };
  }

  console.error(chalk.red('\n  Error: No API key found.\n'));
  console.error(chalk.bold('  Option 1 — Groq (free):'));
  console.error(chalk.dim('    Sign up  : https://console.groq.com'));
  console.error(chalk.dim('    Mac/Linux: export GROQ_API_KEY=gsk_...'));
  console.error(chalk.dim('    Windows  : $env:GROQ_API_KEY="gsk_..."\n'));
  console.error(chalk.bold('  Option 2 — Claude (paid, higher quality):'));
  console.error(chalk.dim('    Sign up  : https://console.anthropic.com'));
  console.error(chalk.dim('    Mac/Linux: export ANTHROPIC_API_KEY=sk-ant-...'));
  console.error(chalk.dim('    Windows  : $env:ANTHROPIC_API_KEY="sk-ant-..."\n'));
  process.exit(1);
}
