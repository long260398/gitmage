# ai-commit

> Generate conventional commit messages from staged changes using AI — free with Groq, or higher quality with Claude.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@long260398/ai-commit.svg)](https://www.npmjs.com/package/@long260398/ai-commit)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)

## Demo

```bash
$ git add src/auth.ts
$ ai-commit

  ai-commit  ·  AI-powered git commits

  ⠙ Generating commit message...

  ✔ Suggested commit message:

  ❯ feat(auth): add JWT token validation middleware

  Press Enter to confirm, or type to edit (Ctrl+C to cancel):
  >

  ✔ Committed: feat(auth): add JWT token validation middleware
```

## Features

- **Zero configuration** — set your API key once, run `ai-commit` anywhere
- **Always conventional** — follows `feat/fix/docs/chore` format automatically
- **Edit before commit** — review and change the message before it lands
- **Dry run mode** — preview without committing: `ai-commit --dry-run`
- **Works with any stack** — language and framework agnostic

## Getting Started

### Prerequisites

- Node.js 18+
- An API key — **Groq is free**, Claude is paid but higher quality

### Install

```bash
npm install -g @long260398/ai-commit
```

Or try without installing:

```bash
npx @long260398/ai-commit --dry-run
```

### Set your API key

**Option 1 — Groq (free):** [console.groq.com](https://console.groq.com)

```bash
# Mac / Linux
export GROQ_API_KEY=gsk_your-key-here

# Windows PowerShell
$env:GROQ_API_KEY="gsk_your-key-here"
```

**Option 2 — Claude (higher quality):** [console.anthropic.com](https://console.anthropic.com) — ~$0.0001/commit

```bash
# Mac / Linux
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

The tool auto-detects which key is set. Set one and run.

## Usage

Stage your changes, then run:

```bash
git add .
ai-commit
```

Preview without committing:

```bash
ai-commit --dry-run
```

Check version:

```bash
ai-commit --version
```

## Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **AI**: Groq (Llama 3.3, free) or Claude Haiku (paid)
- **Format**: Conventional Commits

## Contributing

Pull requests are welcome. For major changes, open an issue first.

## License

[MIT](LICENSE)

## Support

If this saves you time on every commit, consider [sponsoring on GitHub](https://github.com/sponsors/long260398).
