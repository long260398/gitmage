# gitmage

> Stop writing commit messages. Stage your changes, run `gitmage`, pick from 3 AI-generated options in seconds.

[![CI](https://github.com/long260398/gitmage/actions/workflows/ci.yml/badge.svg)](https://github.com/long260398/gitmage/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/gitmage.svg)](https://www.npmjs.com/package/gitmage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)

## Demo

```
$ git add src/auth.ts
$ gitmage

  gitmage  ·  AI-powered git commits

  ✔ Suggested messages:

  ❯ feat(auth): add JWT token validation middleware
    feat: implement token validation for auth module
    feat(auth): validate incoming JWT tokens on request

    ↻  Regenerate
    ✕  Cancel

  ↑↓ to move  Enter to select

  ✔ Committed: feat(auth): add JWT token validation middleware
```

## Features

- **3 options every time** — pick the best one with arrow keys, or regenerate instantly
- **Free or paid** — Groq (Llama 3.3, free) or Claude Haiku (~$0.0001/commit)
- **Multilingual commits** — `--lang=ja` for Japanese, `--lang=vi` for Vietnamese, and more
- **Commit and push in one step** — `--push` flag commits then pushes immediately
- **Config file support** — persist your preferred provider in `~/.gitmagerc`
- **Dry-run mode** — preview suggestions without committing

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com) or paid [Anthropic API key](https://console.anthropic.com)

### Install

```bash
npm install -g gitmage
```

Or try without installing:

```bash
npx gitmage --dry-run
```

### Set your API key

**Groq (free):**

```bash
# Mac / Linux
export GROQ_API_KEY=gsk_your-key-here

# Windows PowerShell
$env:GROQ_API_KEY="gsk_your-key-here"
```

**Claude (higher quality, ~$0.0001/commit):**

```bash
# Mac / Linux
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

The tool auto-detects which key is set. Set one and run.

## Usage

```bash
# Stage and generate
git add .
gitmage

# Preview without committing
gitmage --dry-run

# Commit and push in one command
gitmage --push

# Force a specific provider
gitmage --provider=claude
gitmage --provider=groq

# Commit message in another language
gitmage --lang=ja   # Japanese
gitmage --lang=vi   # Vietnamese
gitmage --lang=zh   # Chinese

# Prepend a ticket ID
gitmage --prefix="PROJ-123"
```

### Config file

Create `~/.gitmagerc` to persist preferences across sessions:

```json
{
  "provider": "claude",
  "language": "en"
}
```

Priority order: `--provider` flag → `~/.gitmagerc` → auto-detect from env.

## Supported Languages

`en` `ja` `vi` `zh` `ko` `es` `fr` `de` `pt`

Type and scope always stay in English — only the description is translated.

## Stack

| | |
|---|---|
| Language | TypeScript 5 |
| Runtime | Node.js 18+ |
| AI (free) | Groq — Llama 3.3 70B |
| AI (paid) | Anthropic — Claude Haiku |
| Format | Conventional Commits |

## Troubleshooting

**`Nothing staged`** — Run `git add <files>` before running gitmage.

**`No API key found`** — Set `GROQ_API_KEY` or `ANTHROPIC_API_KEY` in your environment.

**Arrow keys not working** — Use a modern terminal (Windows Terminal, iTerm2, or any ANSI-compatible shell).

**`git push` failed** — Ensure your branch has an upstream: `git push -u origin <branch>` once, then `gitmage --push` works from there.

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)

## Support

If gitmage saves you time on every commit, consider [sponsoring on GitHub](https://github.com/sponsors/long260398).
