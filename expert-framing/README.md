# Expert framing

Telling Claude "you are a marketing expert" before a task makes the output better. Everyone who uses Claude seriously knows this. Almost nobody does it, because remembering to write it on every prompt is work, and when you do remember you usually write it too vaguely to change anything.

This skill does it for you. On every prompt, Claude works out which expert would actually change the answer, says so in one line, and then does the work to that expert's standards.

```
Expertise: survey methodology (bias, response rate) · data storytelling for a decision-maker
```

You see the line, so you can correct it when it picks wrong.

## The part that makes it work

A persona is useless until you say what the expert is measured by.

"A marketing expert" changes nothing. "A landing page specialist measured on conversion rate, not on how the page reads" changes something specific: it cuts your elegant opening paragraph. That third piece is the whole trick, and it is what the skill tries to produce every time.

The other half is knowing when to shut up. Most prompts do not need a persona, and a generic one is worse than none. Roughly a third of the calibration table in `SKILL.md` is examples of when to say nothing at all.

## What you need

- Claude Code
- Node.js on your PATH (run `node --version` to check)

No dependencies, no account, nothing phones home.

## Install

**1. Download it**

Windows, in CMD:

```
git clone --depth 1 https://github.com/UriIr0n/claude-skills-shared.git "%TEMP%\cskills"
mkdir "%USERPROFILE%\.claude\hooks" 2>nul
xcopy /E /I /Y "%TEMP%\cskills\expert-framing" "%USERPROFILE%\.claude\skills\expert-framing"
copy /Y "%TEMP%\cskills\expert-framing\hooks\expert-framing.js" "%USERPROFILE%\.claude\hooks\"
rmdir /S /Q "%TEMP%\cskills"
```

macOS or Linux:

```
git clone --depth 1 https://github.com/UriIr0n/claude-skills-shared.git /tmp/cskills
mkdir -p ~/.claude/skills ~/.claude/hooks
cp -r /tmp/cskills/expert-framing ~/.claude/skills/
cp /tmp/cskills/expert-framing/hooks/expert-framing.js ~/.claude/hooks/
rm -rf /tmp/cskills
```

**2. Wire up the hook**

Open `~/.claude/settings.json` and add a `hooks` key. If the file already has one, merge into it instead of replacing it.

macOS and Linux:

```json
"hooks": {
  "UserPromptSubmit": [
    {
      "hooks": [
        { "type": "command", "command": "node $HOME/.claude/hooks/expert-framing.js", "timeout": 10 }
      ]
    }
  ]
}
```

Windows, using your real absolute path with forward slashes:

```json
"command": "node \"C:/Users/YOURNAME/.claude/hooks/expert-framing.js\""
```

Check the file still parses before you walk away. A malformed `settings.json` silently disables every setting in it, not just the broken key:

```
node -e "JSON.parse(require('fs').readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.claude/settings.json','utf8'))"
```

No output means it parsed.

**3. Reload**

Type `/hooks` in Claude Code and close the menu. Restarting works too. The settings watcher only picks up new hooks after a reload, so nothing fires until you do this.

## Using it

Nothing. Ask Claude for something substantial and the line shows up. Ask it to run `git status` and it stays quiet.

If it picks the wrong expert, say so in plain language and it will use yours instead. A persona never outranks something you told it directly.

## Skipping it without uninstalling

Delete the `UserPromptSubmit` block from `settings.json` and reload. The skill stays installed and Claude will still load it when it judges the task worth framing, just not on every prompt.

## Why a hook and not just the skill

A skill loads when the model decides it is relevant to what you asked. For most skills that is correct behaviour. For this one it is not, because the whole point is that it runs before the model has committed to an approach, including on the prompts where it would not have thought to reach for it. "Usually" is the wrong reliability target here.

A `UserPromptSubmit` hook fires on every prompt, from the harness, before the model sees anything. It also survives compaction, which a line in `CLAUDE.md` does not.

The cost is real: about 200 tokens injected into every prompt, including the ones where the skill will correctly say nothing. I decided that was worth it. If you disagree, delete the hook block and keep the skill.

## Why the hook does no filtering

The obvious optimization is to look at the prompt text and skip the injection for short or mechanical ones. I tried writing that and threw it away. Keyword matching gets it wrong in both directions, and a hook that silently fails to fire is much harder to notice than one that costs you a few tokens.

So the script is deliberately stupid. It prints the same text every time, and every skip condition lives inside that text, where the model can apply judgment instead of a regex.
