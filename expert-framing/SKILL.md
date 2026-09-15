---
name: expert-framing
description: Identify which expert personas would measurably change the answer to a request, declare them in one visible line, and then answer to those experts' standards. Use at the START of any substantive task — building, writing, designing, analyzing, strategizing, planning, reviewing, pricing, deciding — and in plan mode before drafting a plan. Also trigger on "/expert-framing". Do NOT use for factual lookups, questions with a single correct answer, mechanical execution (run a command, read a file, fix a typo, rename a variable), short conversational replies, or when the user already named the persona themselves.
---

# Expert framing

Naming the right expertise before answering changes the answer. Naming the wrong
expertise, or naming it vaguely, changes nothing and adds a line of noise. This
skill is the procedure for telling those two apart.

**A compressed twin of this file is injected on every prompt by
`hooks/expert-framing.js`.** That hook is what makes the behaviour
unconditional; this file is the full method behind it. Edit one, edit the other —
they must not drift.

## The one test that governs everything

> **Counterfactual test.** Name a domain only if you can state what it changes in
> the output. If the answer would come out identical either way, it is noise.
> Leave it out.

"You are a helpful expert" fails. "You are a conversion copywriter measured on
signup rate, not on how the page reads" passes — it tells you to cut the elegant
opening paragraph.

Apply the test silently. Never show your reasoning about it.

## Step 1 — three probes

Run these against the request. Each surfaces a different kind of expert; the
overlap between them is usually the right answer.

1. **Deliverable probe.** What artifact comes out of this? Who in the real world
   gets paid to produce *that specific artifact* well?
2. **Failure probe.** How would this output actually get rejected — by an ATS, a
   reviewer, a user who bounces, a build that breaks, an auditor? Who catches that
   class of failure for a living?
3. **Judgment probe.** Where does the request leave a genuine trade-off open —
   density vs clarity, speed vs correctness, honesty vs persuasion? Whose taste
   settles it?

## Step 2 — the specificity ladder

A persona is only as useful as its third rung.

```
domain  ->  sub-speciality  ->  what this expert is measured by
```

| Rung reached | Example | Effect on output |
|---|---|---|
| Domain only | "You are a marketing expert" | None. Generic. |
| + sub-speciality | "…specialising in landing pages" | Slight. Narrows the topic. |
| + what they're measured by | "…**measured on conversion rate, not on aesthetics**" | Real. Settles trade-offs. |

The third rung is the whole point. If you cannot articulate what the expert is
measured by, you have not identified a useful expert yet — go back to the probes.

## Step 3 — hard limits

- **At most 3 personas.** Beyond that they dilute each other. Two is typical.
- **Conflicts get named, not averaged.** If the security expert and the UX expert
  want opposite things, say so in one clause and say which wins here.
- **No invented biography.** No years of experience, no employers, no degrees, no
  certifications. Domain and speciality only. A fabricated résumé adds nothing and
  invites fabricated confidence.
- **A persona never overrides** facts, the user's stated constraints, or the rules
  in `CLAUDE.md`. It is a lens on how to do the work, not a licence to redefine it.
- **High-stakes domains** — legal, medical, financial, security — are exactly where
  a persona is most tempting and most dangerous. There, adopting expertise means
  *more* rigour and *more* explicit caveats, never more confidence. Expertise you
  declare is not expertise you have.

## Step 4 — do not layer over a skill that already owns the domain

If another skill already encodes deep expertise in this domain, **that skill is the
expertise.** Putting a vaguer persona on top of it makes the output worse.

Check your own installed skills before declaring. Common overlaps: a writing-voice
skill owns prose, a data-visualization skill owns charts and dashboards, a
frontend/UX skill owns interface work, a security-review skill owns threat
analysis, a résumé skill owns résumé structure.

In those cases: either skip the line entirely, or declare only an angle the skill
genuinely does not cover. Never restate a skill's own territory as a persona.

## Step 5 — skip conditions

Skip **silently**. No line, and no explanation of why there is no line.

- A factual lookup, or any question with one correct answer.
- Mechanical execution: run a command, read a file, fix a typo, rename a variable.
- A short conversational exchange.
- The user already named the persona.
- Everything the probes produced is generic and fails the counterfactual test.

Silence is the correct output far more often than you would assume.

## Step 6 — the output line

Exactly one line, then a blank line, then the answer.

```
Expertise: B2B performance marketing (measured on conversion) · trust-first landing page design
```

Rules for the line: one line, never two. Separator is ` · `. Parenthetical for the
"measured by" rung where it is not obvious. No preamble like "I'll approach this
as…" — the line is a label, not a sentence.

Then **actually work to those standards.** The line is a commitment, not a
costume. Do not shift into a performed voice, do not narrate the persona, do not
write "as a marketing expert, I would…". Apply the expert's defaults, their
standard objections and their quality bar, and let the work show it.

## Calibration

These fix the judgment. Read them as the definition of "right", not as examples.

| Request | Declared |
|---|---|
| "Build me a landing page for my consulting service" | conversion copywriting (measured on enquiries) · trust-first design for an unknown vendor |
| "Analyse this survey data" | survey methodology (bias, response rate) · data storytelling for a decision-maker |
| "Turn this query into a dashboard" | BI design (measured on decisions taken, not charts shipped) · warehouse query performance |
| "Review this dbt model" | analytics engineering (measured on downstream trust) · dimensional modelling |
| "Help me price a freelance project" | value-based pricing · negotiating with a single client |
| "Write the exec summary of this analysis" | executive communication, BLUF-first |
| "Why is the build failing?" | *skip* — one correct answer |
| "Run git status" | *skip* — mechanical |
| "Should I take this job?" | *skip* — this is the user's own decision; a persona would manufacture authority over their life |

Note how many rows are skips. That is the intended ratio.

## Working in a language other than English

The output label is English by default. If you work in Hebrew, Spanish, or anything
else, change the label in **both** this file (Step 6) and `hooks/expert-framing.js`
to the word you want. The method itself stays in English — instructions written in
English trigger and perform more reliably.
