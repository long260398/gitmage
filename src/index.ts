import chalk from 'chalk';
import { version } from '../package.json';
import { isGitRepo, getStagedDiff, runCommit, runPush } from './git';
import { generateMessages } from './ai';
import { getConfig } from './config';
import { printHeader, startSpinner, selectCommitMessage } from './ui';

const args = process.argv.slice(2);

const flags = {
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  version: args.includes('--version') || args.includes('-v'),
  push: args.includes('--push'),
};

const providerArg = args.find((a) => a.startsWith('--provider='));
const providerOverride = providerArg ? providerArg.slice('--provider='.length) : undefined;

const langArg = args.find((a) => a.startsWith('--lang='));
const langOverride = langArg ? langArg.slice('--lang='.length) : undefined;

const prefixArg = args.find((a) => a.startsWith('--prefix='));
const prefix = prefixArg ? prefixArg.slice('--prefix='.length).trim() : null;

async function main(): Promise<void> {
  if (flags.version) {
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
        chalk.dim(' first.\n'),
    );
    process.exit(0);
  }

  const config = getConfig(providerOverride, langOverride);

  // Regenerate loop — user can request new suggestions without re-running
  while (true) {
    const stopSpinner = startSpinner(`Generating via ${config.provider}...`);
    let messages: string[];

    try {
      messages = await generateMessages(diff, config);
    } catch (err) {
      stopSpinner();
      console.error(chalk.red(`\n  Error: ${err instanceof Error ? err.message : String(err)}\n`));
      process.exit(1);
    }

    stopSpinner();

    if (prefix) {
      messages = messages.map((m) => `${prefix} ${m}`);
    }

    if (flags.dryRun) {
      console.log(`  ${chalk.green('✔')} ${chalk.bold('Suggested messages:')}\n`);
      messages.forEach((m, i) => console.log(`  ${chalk.dim(`${i + 1}.`)} ${m}`));
      console.log(chalk.dim('\n  Dry run — no commit created.\n'));
      process.exit(0);
    }

    const result = await selectCommitMessage(messages);

    if (result.type === 'cancelled') {
      console.log(chalk.dim('  Cancelled.\n'));
      process.exit(0);
    }

    if (result.type === 'regenerate') {
      console.log(chalk.dim('  Regenerating...\n'));
      continue;
    }

    try {
      runCommit(result.message);
      console.log(chalk.green('  ✔ Committed: ') + chalk.bold(result.message));

      if (flags.push) {
        const stopPush = startSpinner('Pushing...');
        try {
          runPush();
          stopPush();
          console.log(chalk.green('  ✔ Pushed.\n'));
        } catch (err) {
          stopPush();
          console.error(
            chalk.red(`\n  Push failed: ${err instanceof Error ? err.message : String(err)}\n`),
          );
          process.exit(1);
        }
      } else {
        console.log('');
      }

      break;
    } catch (err) {
      console.error(
        chalk.red(`\n  Commit failed: ${err instanceof Error ? err.message : String(err)}\n`),
      );
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(chalk.red(`\n  Fatal: ${err instanceof Error ? err.message : String(err)}\n`));
  process.exit(1);
});
