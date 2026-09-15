# claude-skills-shared

Claude Code skills I built for my own work and am happy to hand to anyone else.

Each folder is self-contained. Read its README, copy what you need, done. Nothing here phones home, needs an account, or installs dependencies.

## Skills

### [expert-framing](expert-framing/)

Claude works out which expert would actually change the answer to your prompt, says so in one line, and then works to that expert's standards. A `UserPromptSubmit` hook runs it on every prompt, so you never have to remember to write "you are a marketing expert" yourself.

The useful part is the specificity rule: a persona does nothing until you say what that expert is measured by. And knowing when to stay quiet, which is most of the time.

Install steps are in [expert-framing/README.md](expert-framing/README.md).

### [passdown](passdown/)

Two hooks and one JSON file that carry a session's context into the next one. When a long Claude Code session is about to be compacted, Claude writes a handoff into your project folder. The next time you open Claude Code in that folder, it gets read back automatically.

The name is the shift-work log an outgoing shift leaves the incoming one, so nobody starts blind.

Install steps are in [passdown/README.md](passdown/README.md).

## Questions

Open an issue, or find me on LinkedIn.
