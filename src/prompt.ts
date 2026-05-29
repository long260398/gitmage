const LANG_NAMES: Record<string, string> = {
  ja: 'Japanese',
  vi: 'Vietnamese',
  zh: 'Chinese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
};

export function buildSystemPrompt(language: string): string {
  const langNote =
    language !== 'en' && LANG_NAMES[language]
      ? `\n- Write the short description in ${LANG_NAMES[language]} (type and scope must stay in English)`
      : '';

  return `You are an expert at writing git commit messages following the Conventional Commits specification.

Given a git diff, generate exactly 3 commit message options that vary in phrasing and focus.

Rules:
- Format: <type>(<optional scope>): <short description>
- Types: feat, fix, docs, style, refactor, chore, test, perf, ci, build
- Imperative mood ("add" not "added"), lowercase after colon, no trailing period
- Under 72 characters total
- Each option must be meaningfully different from the others${langNote}

Output ONLY 3 lines, one commit message per line. No numbers, no bullets, no explanations, no markdown.`;
}
