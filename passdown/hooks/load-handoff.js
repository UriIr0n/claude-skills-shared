// SessionStart hook: inject the previous session's handoff into context.
// Reads .handoff-latest.json from the session cwd. Silent no-op when absent.
const fs = require('fs');
const path = require('path');

const MAX_CONTEXT_CHARS = 12000;
const file = path.join(process.cwd(), '.handoff-latest.json');

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function list(label, items) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return `\n${label}:\n` + items.map((i) => `- ${i}`).join('\n') + '\n';
}

try {
  if (!fs.existsSync(file)) process.exit(0);

  const h = JSON.parse(fs.readFileSync(file, 'utf8'));
  const stamp = h.timestamp || 'unknown time';

  let ctx =
    `Handoff from the previous session in this directory (${stamp}), loaded from ${file}.\n` +
    `Project: ${h.project || path.basename(process.cwd())}\n` +
    list('Decisions', h.decisions) +
    list('Shipped changes', h.shipped_changes) +
    list('Key files', h.key_files) +
    (h.running_state ? `\nRunning state: ${h.running_state}\n` : '') +
    list('Verification steps', h.verification_steps) +
    list('Deferred', h.deferrals) +
    list('Open questions', h.open_questions) +
    (h.full_summary ? `\nSummary:\n${h.full_summary}\n` : '');

  if (ctx.length > MAX_CONTEXT_CHARS) {
    ctx = ctx.slice(0, MAX_CONTEXT_CHARS) +
      `\n\n[truncated — read ${file} directly for the rest]`;
  }

  emit({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx },
    systemMessage: `Previous session context loaded — ${stamp}`,
  });
} catch (err) {
  emit({ systemMessage: `Could not read ${file}: ${err.message}` });
}
