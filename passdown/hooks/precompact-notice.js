// PreCompact hook: nudge toward writing a handoff before auto-compaction discards context.
process.stdout.write(JSON.stringify({
  systemMessage: 'Context is about to auto-compact — run the passdown skill first so the next session can resume.',
}));
