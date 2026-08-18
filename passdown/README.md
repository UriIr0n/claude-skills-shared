# Passdown

When a long Claude Code session fills up, the conversation gets compacted and half the detail goes with it. You open a fresh session and start explaining what you already decided and what already works.

Passdown fixes that with two hooks and one JSON file. Before the conversation is compacted, Claude writes a handoff into your project folder. The next time you open Claude Code in that folder, the handoff is read back into context automatically. You paste nothing.

The name comes from shift work. In the navy, in hospitals, on factory floors, the outgoing shift leaves the incoming one a written log so nobody starts blind.

## What you need

- Claude Code
- Node.js on your PATH (run `node --version` to check)

That is all. No install script, no dependencies, no account anywhere.

## Install

**1. Copy the skill**

Put the `passdown` folder into your skills directory:

```
~/.claude/skills/passdown/
```

On Windows that is `C:\Users\<you>\.claude\skills\passdown\`.

**2. Copy the two hook scripts**

Move `hooks/load-handoff.js` and `hooks/precompact-notice.js` to:

```
~/.claude/hooks/
```

Create the `hooks` folder if it does not exist. You can keep them anywhere you like as long as step 3 points at the right place.

**3. Wire them up in settings.json**

Open `~/.claude/settings.json` and add a `hooks` key. If the file already has one, merge into it instead of replacing it.

macOS and Linux:

```json
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        { "type": "command", "command": "node $HOME/.claude/hooks/load-handoff.js", "timeout": 10 }
      ]
    }
  ],
  "PreCompact": [
    {
      "matcher": "auto",
      "hooks": [
        { "type": "command", "command": "node $HOME/.claude/hooks/precompact-notice.js", "timeout": 10 }
      ]
    }
  ]
}
```

Windows, using your real absolute path with forward slashes:

```json
"command": "node \"C:/Users/YOURNAME/.claude/hooks/load-handoff.js\""
```

Check the file still parses before you walk away. A malformed `settings.json` silently disables every setting in it, not just the broken key:

```
node -e "JSON.parse(require('fs').readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.claude/settings.json','utf8'))"
```

No output means it parsed.

**4. Reload**

Type `/hooks` in Claude Code and close the menu. Restarting works too. Claude Code's settings watcher only picks up new hooks after a reload, so nothing fires until you do this.

## Using it

Type `/passdown` in any project. Optionally say what the next session should focus on:

```
/passdown finish the auth work
```

You get a short summary in chat and a new `.handoff-latest.json` in that project folder. If the folder is a git repo, the file is added to `.gitignore` first.

Close the session. Open Claude Code again in the same folder. You will see `Previous session context loaded` near the top, and Claude already knows what was decided and what shipped.

The `PreCompact` hook also nudges Claude to write one on its own when the conversation is about to be auto-compacted, so you are covered even if you forget.

## What ends up in the file

Ten fields: timestamp, project, decisions, shipped changes, key files, running state, verification steps, deferrals, open questions, and a narrative summary. Paths only, never pasted code. The skill redacts credentials on the way in, so it records where a password lives and not the password.

The loader caps what it injects at 12 KB, so a bloated handoff cannot eat the context it was meant to save.

## Notes

The handoff is keyed to the folder, not the project. The loader reads from whatever directory the session opened in, so a handoff written into your home folder would load into every unrelated session. The skill refuses to do that and asks which project you meant.

In a folder with no handoff the loader prints nothing and exits 0. It costs you nothing in every other project.

If a hook does not seem to fire, run its command yourself in a terminal first, since that catches most problems. Then check the JSON nests two arrays deep, check the matcher, reload with `/hooks`, and use `claude --debug` to see hook execution logged. A hook that succeeds silently shows nothing in the UI, which is by design.

## Why PreCompact

The obvious trigger is "watch the token count and fire when it spikes." That does not work. Claude cannot see its own token count and is a poor judge of whether its own output just got worse, so a trigger built on either signal fires at random or never fires at all, and you have no way to tell which.

`PreCompact` is an event the harness fires at exactly the moment context is about to be lost. Attach to something the harness emits, not to a state you hope the model will notice.
