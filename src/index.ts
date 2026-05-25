import chalk from 'chalk';
import { version } from '../package.json';
import { isGitRepo, getStagedDiff, runCommit } from './git';
import { generateMessage } from './ai';
import { getConfig } from './config';
import { printHeader, startSpinner, printSuggestion, confirmMessage } from './ui';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');
const isVersion = args.includes('--version') || args.includes('-v');
const prefixArg = args.find((a) => a.startsWith('--prefix='));
const prefix = prefixArg ? prefixArg.slice('--prefix='.length).trim() : null;

async function main(): Promise<void> {
  if (isVersion) {
    console.log(version);
    process.exit(0);
  }

  printHeader();

  if (!isGitRepo()) {
    console.error(chalk.red('  Error: not a git repository.\n'));
    process.exit(1);
  }

  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(
      chalk.yellow('  Nothing staged.') +
      chalk.dim(' Run ') +
      chalk.white('git add <files>') +
      chalk.dim(' first.\n')
    );
    process.exit(0);
  }

  const config = getConfig();

  const stopSpinner = startSpinner(`Generating via ${config.provider}...`);
  let message: string;

  try {
    message = await generateMessage(diff, config);
  } catch (err) {
    stopSpinner();
    const text = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`\n  Error: ${text}\n`));
    process.exit(1);
  }

  stopSpinner();

  if (prefix) {
    message = `${prefix} ${message}`;
  }

  printSuggestion(message);

  if (isDryRun) {
    console.log(chalk.dim('  Dry run — no commit created.\n'));
    process.exit(0);
  }

  const confirmed = await confirmMessage(message);

  if (confirmed === null) {
    console.log(chalk.dim('\n  Cancelled.\n'));
    process.exit(0);
  }

  try {
    runCommit(confirmed);
    console.log(chalk.green('\n  ✔ Committed: ') + chalk.bold(confirmed) + '\n');
  } catch (err) {
    const text = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`\n  Commit failed: ${text}\n`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(chalk.red(`\n  Fatal: ${err instanceof Error ? err.message : String(err)}\n`));
  process.exit(1);
});
