import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export type Provider = 'groq' | 'claude';

export interface Config {
  provider: Provider;
  apiKey: string;
  language: string;
}

interface RcFile {
  provider?: Provider;
  language?: string;
}

function readRcFile(): RcFile {
  try {
    const rcPath = join(homedir(), '.gitmagerc');
    if (!existsSync(rcPath)) return {};
    return JSON.parse(readFileSync(rcPath, 'utf-8')) as RcFile;
  } catch {
    return {};
  }
}

function missingKeyError(provider: Provider): never {
  const key = provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'GROQ_API_KEY';
  console.error(chalk.red(`\n  Error: --provider=${provider} specified but ${key} is not set.\n`));
  process.exit(1);
}

export function getConfig(providerOverride?: string, langOverride?: string): Config {
  const rc = readRcFile();
  const language = langOverride ?? rc.language ?? 'en';

  const groqKey = process.env.GROQ_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;

  // Priority: CLI flag → rc file → auto-detect from env
  const preferred = providerOverride ?? rc.provider;

  if (preferred === 'claude') {
    if (!claudeKey) missingKeyError('claude');
    return { provider: 'claude', apiKey: claudeKey, language };
  }

  if (preferred === 'groq') {
    if (!groqKey) missingKeyError('groq');
    return { provider: 'groq', apiKey: groqKey, language };
  }

  if (groqKey) return { provider: 'groq', apiKey: groqKey, language };
  if (claudeKey) return { provider: 'claude', apiKey: claudeKey, language };

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
