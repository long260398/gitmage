# ai-commit

> Generate conventional commit messages from staged changes using Claude AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
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
- Anthropic API key — [get one here](https://console.anthropic.com)

### Install

```bash
npm install -g ai-commit
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
# Add to ~/.bashrc or ~/.zshrc to persist across sessions
```

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

## Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **AI**: Claude Haiku via Anthropic SDK
- **Format**: Conventional Commits

## Contributing

Pull requests are welcome. For major changes, open an issue first.

## License

[MIT](LICENSE)

## Support

If this saves you time on every commit, consider [sponsoring on GitHub](https://github.com/sponsors/long260398).
