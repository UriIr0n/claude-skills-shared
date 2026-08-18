---
name: passdown
description: Compact the current session into a machine-readable .handoff-latest.json in the project directory, so a fresh session in that same directory reloads the context automatically via the SessionStart hook. Use this when the conversation is about to be auto-compacted (the PreCompact hook says so), when the user asks to hand off / wrap up / "start fresh and continue" / "תעשה handoff" / "נגמר לי הקונטקסט", or on "/passdown". Do NOT use it as an end-of-task summary — a finished task with plenty of context left needs a normal reply, not a handoff file. For a human-readable markdown doc in the temp dir instead, that is the separate /handoff skill.
argument-hint: "What will the next session focus on?"
---

# Session handoff

Write the current session's state to `.handoff-latest.json` so the next session picks up
where this one stopped. The file is read automatically at session start by
`~/.claude/hooks/load-handoff.js` — nobody has to paste anything.

## 1. Resolve the target directory

The handoff belongs next to the project it describes.

- Session cwd is a project directory → write there.
- Session cwd is `C:\Users\97252` (the home directory) → **ask** which project under
  `Projects\עבודה\` or `Projects\אישי\` this session was about. Never drop the file in home;
  the loader keys off cwd, so a handoff in home would load into every unrelated session.

## 2. Repo guard — run before writing

If the target directory is a git repo (`git rev-parse --git-dir` succeeds), make sure
`.handoff-latest.json` is in `.gitignore`; append it if it isn't. A handoff describes working
state and must never be committed. This matters most under `Projects\עבודה\`, where the global
`CLAUDE.md` forbids organisational data entering a work repo.

## 3. Redact

Never put credentials in the file: no API keys, passwords, tokens, connection strings, session
cookies, or personal data. Point at where the credential lives instead —
"login stored in the ariel-dashboard-credentials memory", not the password itself.

## 4. Write the JSON

Write `<target>/.handoff-latest.json` with exactly these keys:

```json
{
  "timestamp": "ISO-8601, e.g. 2026-08-18T14:32:00+03:00",
  "project": "project folder name",
  "decisions": ["choices made and why, one line each"],
  "shipped_changes": ["what actually landed — file written, deployed, committed"],
  "key_files": ["absolute or repo-relative paths only"],
  "running_state": "servers, background jobs, deploy status, anything still live",
  "verification_steps": ["exact commands/URLs that prove it works"],
  "deferrals": ["deliberately postponed, with the reason"],
  "open_questions": ["unresolved, needs a decision next session"]
  ,"full_summary": "narrative a fresh agent can act on"
}
```

Rules that keep the file small enough to be worth loading:

- Array entries are one line each. Pointers, not prose.
- `full_summary` carries the narrative. Do not restate array contents in it.
- `key_files` holds paths. Never paste file contents or diffs.
- Anything already written down — a plan file, PRODUCT.md, an ADR, a commit — gets referenced
  by path or SHA, not duplicated.
- Distinguish **done** from **claimed**: only list something under `shipped_changes` if it was
  actually verified. Unverified work goes in `open_questions` with what still needs checking.
- If the user passed an argument, it describes the next session's focus — weight
  `full_summary` and `open_questions` toward that.

## 5. Report back

Show the user a condensed view — decisions, shipped changes, open questions — then:

> Handoff saved to `<path>`. Start a fresh session in that directory and it loads automatically.

Keep it short. The point of a handoff is that the session is out of room; a long report defeats it.

## Suggested skills for the next session

Include a short `full_summary` note naming any skill the next agent should invoke
(`human` before writing prose, `resume-tailor`, `job-finder`, etc.) so the pipeline resumes intact.
