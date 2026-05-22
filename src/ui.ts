import chalk from 'chalk';
import * as readline from 'readline';

export function printHeader(): void {
  console.log(chalk.bold.cyan('\n  ai-commit') + chalk.dim('  ·  AI-powered git commits\n'));
}

export function startSpinner(text: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r  ${chalk.cyan(frames[i])} ${chalk.dim(text)}`);
    i = (i + 1) % frames.length;
  }, 80);

  // Returns a stop function — caller decides when to stop the spinner
  return () => {
    clearInterval(interval);
    process.stdout.write('\r\x1b[K'); // erase the spinner line
  };
}

export function printSuggestion(message: string): void {
  console.log(`  ${chalk.green('✔')} ${chalk.bold('Suggested commit message:')}\n`);
  console.log(`  ${chalk.cyan('❯')} ${chalk.white.bold(message)}\n`);
}

export async function confirmMessage(suggested: string): Promise<string | null> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      chalk.dim('  Press Enter to confirm, or type to edit (Ctrl+C to cancel):\n  > '),
      (input) => {
        rl.close();
        const trimmed = input.trim();
        // Empty input = user accepted the suggestion as-is
        resolve(trimmed === '' ? suggested : trimmed);
      }
    );

    rl.on('SIGINT', () => {
      rl.close();
      process.stdout.write('\n');
      resolve(null);
    });
  });
}
