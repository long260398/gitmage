import chalk from 'chalk';

export function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    console.error(chalk.red('\n  Error: ANTHROPIC_API_KEY is not set.\n'));
    console.error(chalk.dim('  Get your key : https://console.anthropic.com'));
    console.error(chalk.dim('  Mac / Linux  : export ANTHROPIC_API_KEY=sk-ant-...'));
    console.error(chalk.dim('  Windows      : $env:ANTHROPIC_API_KEY="sk-ant-..."\n'));
    process.exit(1);
  }

  return key;
}
