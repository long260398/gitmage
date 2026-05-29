import chalk from 'chalk';

export function printHeader(): void {
  console.log(chalk.bold.cyan('\n  gitmage') + chalk.dim('  ·  AI-powered git commits\n'));
}

export function startSpinner(text: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r  ${chalk.cyan(frames[i])} ${chalk.dim(text)}`);
    i = (i + 1) % frames.length;
  }, 80);
  return () => {
    clearInterval(interval);
    process.stdout.write('\r\x1b[K');
  };
}

export type SelectResult =
  | { type: 'selected'; message: string }
  | { type: 'regenerate' }
  | { type: 'cancelled' };

export async function selectCommitMessage(messages: string[]): Promise<SelectResult> {
  type Option = { label: string; value: string };

  const msgOpts: Option[] = messages.map((m) => ({ label: m, value: m }));
  const actionOpts: Option[] = [
    { label: chalk.dim('↻  Regenerate'), value: '__regenerate__' },
    { label: chalk.dim('✕  Cancel'), value: '__cancel__' },
  ];
  const options = [...msgOpts, ...actionOpts];
  let selected = 0;

  // Header printed once — not part of the re-rendered block
  console.log(`  ${chalk.green('✔')} ${chalk.bold('Suggested messages:')}\n`);

  // renderBlock draws exactly RENDERED_LINES lines
  // options.length lines + 1 separator blank + 1 footer blank + 1 hint = options.length + 3
  const RENDERED_LINES = options.length + 3;

  const renderBlock = () => {
    for (let i = 0; i < options.length; i++) {
      if (i === msgOpts.length) process.stdout.write('\n'); // separator before actions
      const isChosen = i === selected;
      const prefix = isChosen ? chalk.cyan('  ❯ ') : '    ';
      const label =
        isChosen && i < msgOpts.length ? chalk.white.bold(options[i].label) : options[i].label;
      process.stdout.write(`${prefix}${label}\n`);
    }
    process.stdout.write(chalk.dim('\n  ↑↓ to move  Enter to select\n'));
  };

  renderBlock();

  // Non-TTY fallback: auto-select first message
  if (!process.stdin.isTTY) {
    return { type: 'selected', message: messages[0] };
  }

  const clearAndRender = () => {
    // Move up RENDERED_LINES and clear to end of screen
    process.stdout.write(`\x1b[${RENDERED_LINES}A\x1b[J`);
    renderBlock();
  };

  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    const cleanup = () => {
      process.stdin.removeListener('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    const onData = (key: string) => {
      if (key === '') {
        // Ctrl+C
        cleanup();
        process.stdout.write('\n');
        resolve({ type: 'cancelled' });
        return;
      }

      if (key === '\r' || key === '\n') {
        // Enter
        cleanup();
        process.stdout.write('\n');
        const val = options[selected].value;
        if (val === '__regenerate__') resolve({ type: 'regenerate' });
        else if (val === '__cancel__') resolve({ type: 'cancelled' });
        else resolve({ type: 'selected', message: val });
        return;
      }

      if (key === '\x1b[A') {
        // Up arrow
        selected = (selected - 1 + options.length) % options.length;
        clearAndRender();
      } else if (key === '\x1b[B') {
        // Down arrow
        selected = (selected + 1) % options.length;
        clearAndRender();
      }
    };

    process.stdin.on('data', onData);
  });
}
