import { execSync, spawnSync } from 'child_process';

export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function getStagedDiff(): string {
  const result = spawnSync('git', ['diff', '--staged'], { encoding: 'utf-8' });

  if (result.error) {
    throw new Error('git not found. Please install git and try again.');
  }

  return result.stdout;
}

export function runCommit(message: string): void {
  const result = spawnSync('git', ['commit', '-m', message], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error('git commit failed');
  }
}
