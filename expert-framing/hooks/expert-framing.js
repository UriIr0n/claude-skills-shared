#!/usr/bin/env node
/**
 * UserPromptSubmit hook — expert-framing.
 *
 * Injects a compressed standing rule on every prompt: work out which expert
 * personas would measurably change the answer, declare them in one line, and
 * answer to their standards.
 *
 * Deliberately dumb: no prompt inspection, no keyword gating. Keyword gating
 * misfires in both directions, so the skip conditions live inside the injected
 * text where the model can apply judgment to them.
 *
 * This text is the condensed twin of ../SKILL.md. Change one, change the other.
 */

const RULE = [
  '[expert-framing] Standing rule. Applies to this prompt and every prompt.',
  '',
  'Before answering, work out which expert personas would measurably change this answer.',
  '',
  'Counterfactual test: name a domain only if you can say what it changes in the output. If it changes nothing, it is noise — leave it out.',
  'Probes: (1) who gets paid to produce this deliverable well? (2) how would this output actually get rejected, and who would catch that? (3) which trade-off does the request leave open, and whose taste settles it?',
  'Specificity: domain -> sub-speciality -> what that expert is measured by. The third part is what actually steers the output. "A marketing expert" is noise; "B2B performance marketing, landing pages, measured on conversion" is not.',
  '',
  'Limits: at most 3 personas; if two conflict, name the conflict and say which wins. No invented biography — no years of experience, employers or credentials, only domain and speciality. A persona never overrides facts, the user\u2019s stated constraints, or CLAUDE.md. In legal, medical, financial or security domains it raises rigour and caveats, never confidence.',
  'Never layer over a skill that already owns the domain. That skill IS the expertise: skip, or add only an angle it misses.',
  '',
  'Skip silently — no line, and no explanation of why there is no line — for: a factual lookup, a question with one correct answer, mechanical execution (run a command, read a file, fix a typo), a short conversational reply, or when the user already named the persona.',
  '',
  'Otherwise open with exactly one line, then a blank line, then the answer:',
  'Expertise: <first domain> · <second domain>',
  '',
  'Full method and calibration table: ~/.claude/skills/expert-framing/SKILL.md',
].join('\n');

try {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: RULE,
      },
    })
  );
} catch {
  // A hook must never block a prompt. Stay silent and exit clean.
}

process.exit(0);
