# MediLink Appointment Platform: Team 28

[![Tests](https://github.com/karmidd/medilink-team28/actions/workflows/test.yml/badge.svg)](https://github.com/karmidd/medilink-team28/actions/workflows/test.yml)

COMP 354 (Fall 2026), Assignment on Software Engineering Management.

MediLink is a (fictional) Canadian platform where patients of small medical and dental clinics
book, cancel and reschedule appointments and get reminders, and clinic staff manage schedules. It
is already in production. Our team owns the next release.

This repo holds a small prototype of the appointment and reminder code, plus everything we use to
run one short development cycle: the board, the work items, our rules and our daily updates.

| | |
|---|---|
| **Project board** | [MediLink: Team 28, Cycle 1](https://github.com/users/karmidd/projects/3) |
| **Daily updates** | #1 (pinned) |
| **SMART objectives** | #2 (pinned) |
| **Cycle 1** | Tue Nov 3 to Thu Nov 5, 2026 |

## Team and roles

| | Name | GitHub | Role | Also leads |
|---|---|---|---|---|
| 1 | Karam Midani | `karmidd` | **Engineering Manager / Team Lead** | Board and workflow rules, WIP limits, assigning reviewers, removing blockers, development plan (Parts A, B) |
| 2 | Mayar Rekmani | `mayarrekmani` | Developer | Production incident and Five Whys, manager in the coaching session (Parts D, G), assembling the report |
| 3 | Nicolas Sorescu | `Dantanro` | Developer | Workflow observations, risk register (Parts C, E), checking every screenshot |
| 4 | Roman Stikhin | `Romakkkkkk` | Developer | Dashboard, improvement experiment (Parts F, H), final formatting and submission |

**Everyone** owns 2 issues, writes 1 SMART objective, posts 3 daily updates, opens 1 PR, reviews 1 PR,
and presents.

**What the manager does and does not do.** The manager keeps work flowing: refines issues until they
are Ready, watches WIP and review waiting times, and removes blockers. When a developer is stuck,
the manager's first move is to ask questions and pair them with a teammate, not to write the fix.
This is deliberate: last release, one developer solved most hard problems for everyone and the team
came to depend on that person. The manager still owns two small issues and gets reviewed like
everyone else.

**Review rotation.** Every PR is reviewed by someone different, so knowledge spreads across the team.

| PR author | Reviewer |
|---|---|
| Karam | Nicolas |
| Mayar | Karam |
| Nicolas | Roman |
| Roman | Mayar |

## Workflow

**Backlog → Ready → In Progress → Code Review → Verification → Done**

| Column | Meaning | Rule for moving a card in |
|---|---|---|
| Backlog | Request or idea, not ready to start | Anyone can add an issue |
| Ready | Can be started today | Meets the Definition of Ready (below) |
| In Progress | The owner is working on it | Owner assigned, branch created, WIP limit not reached |
| Code Review | PR open, waiting for review | PR says `Closes #N`, reviewer requested, tests pass |
| Verification | PR approved; a teammate who is **not the author** checks each acceptance criterion | PR approved |
| Done | Merged and meets the Definition of Done | Every item in the Definition of Done is ticked |

A **blocked** card stays in its column, gets the `blocked` label, and gets a comment saying what it is
waiting for and who can help.

### Definition of Ready

An issue moves from Backlog to Ready only when it has:

- [ ] an owner (assignee)
- [ ] a `type:` label and a `priority:` label
- [ ] acceptance criteria written as checkboxes that someone else could verify without asking
- [ ] no open questions (otherwise it gets the `needs info` label and stays in Backlog)

Last release, several issues had incomplete requirements. This check is where we catch that, before
anyone starts coding.

### WIP limits

| Column | Limit |
|---|---|
| In Progress | **3** for the team, and **1 per person** |
| Code Review | **2** |
| Verification | **2** |

**Why these numbers.**

- **Stop starting, start finishing.** Last release, developers started new tasks while their own work
  waited for review, and some PRs stayed open for days. With a Code Review limit of 2, as soon as two
  PRs are waiting, the next thing anyone does is review, not pick up a new card.
- **One card each.** We have three developers, so 3 in progress means one card each. When the manager
  takes one of their own issues, it counts too, so the manager's coding cannot crowd out reviewing
  and unblocking.
- **Short cycle.** Cycle 1 is three days. With more work open at once, little would reach Done.
  Four finished items are worth more than eight half-done ones.
- **We will check it.** If cards wait because of the limit rather than because of the work, we
  change the limit. The dashboard (Part F) tracks this.

The limits are set on the board itself (column menu → *Set limit*), so the board warns us when a
column goes over.

### Definition of Done

An item is Done only when:

- [ ] Every acceptance criterion in the issue is met and ticked
- [ ] Tests added or updated for the change, and `npm test` passes
- [ ] The PR says `Closes #N` and is approved by a teammate who is not the author
- [ ] All review comments are resolved
- [ ] A teammate who is not the author verified each acceptance criterion and wrote on the issue what they checked
- [ ] README or docs updated if setup or behaviour changed
- [ ] Merged to `main`, branch deleted, card in **Done**

The PR template repeats this checklist, so it is filled in on every PR. Two defects reached
production last release because expected verification was skipped. Making verification its own
column and its own checklist item means it cannot be skipped quietly.

## Development plan: Cycle 1 (Tue Nov 3 to Thu Nov 5, 2026)

**Goal.** Get release 2.4 ready while running the workflow above: fix both P1 defects (#3 double
booking, #4 wrong time zone), make tests run automatically on every PR (#5), and ship as many P2 items
as the WIP limits allow.

**Scope.** 8 items are assigned. We **commit** to the three P1 items (#3, #4, #5). The P2 and P3 items
are **stretch**: realistically 4 to 6 items will reach Done in three days. The rest go back to Ready
for the next cycle.

| Day | What happens | Who |
|---|---|---|
| Mon Nov 2 | Repo, board, labels, issues and these rules set up | Karam |
| Mon Nov 2 | Accept the repo invite, read this README, post your SMART objective in #2 | Everyone |
| **Tue Nov 3** | Daily update 1 by 10:00 in #1. Each developer pulls one Ready card into In Progress. Production incident reported, incident issue opened | Everyone; Mayar for the incident |
| **Wed Nov 4** | Daily update 2 by 10:00. PRs opened and reviewed within 24 h. Five Whys on the incident. Workflow observations and risk register started. Coaching session | Everyone; Mayar (RCA, coach), Roman (developer in the coaching session), Nicolas (observations, risks) |
| **Thu Nov 5** | Daily update 3 by 10:00. Verification and merge. Dashboard filled from the board. Improvement experiment chosen from our evidence and run. End-of-cycle call, 30 min, 18:00 | Everyone; Roman (dashboard, experiment) |
| Fri Nov 6 on | Report sections, screenshots, presentation rehearsal | Everyone; Mayar assembles, Roman submits |

**Each morning after the updates**, the manager checks the board: WIP per column, PRs waiting for
review and for how long, and `blocked` cards. Anything close to 24 h without review gets a ping.

## Communication

### Asynchronous by default

| What | Where |
|---|---|
| Daily update | One comment in the pinned issue #1, **by 10:00** each cycle day |
| Questions about a work item | A comment on that issue, @mentioning the person. Answer within half a day |
| Questions about code | PR review comments |
| Decisions | A comment on the issue the decision affects, so anyone can find it later |
| Quick "please look at #N" pings | Our group chat. The content itself stays on GitHub |

### Daily update format

```
**Completed:** what moved since the last update (issue/PR numbers)
**Planned:** what I'll do next (issue/PR numbers)
**Blockers / help needed:** what is stopping me and who I need, or "None"
```

Every line names the issue or PR it is about. If the work is not on the board, it does not go in the
update: add an issue first. This keeps updates tied to real work, not a separate status report.

### When we switch to a call

We stay async unless one of these happens:

1. **Production incident affecting patients or clinics** (for example wrong reminders or failed
   bookings): a 15-minute call within 1 hour of the report, with the incident owner, the manager and
   whoever knows that code.
2. **A blocker not solved async within 4 working hours**, or one blocker stopping more than one person.
3. **Discussion going in circles**: more than two rounds of comments on a requirement or PR without
   agreement. A 10-minute call, then the decision is written on the issue.
4. **Coaching and personal feedback**: always a call, never in a public thread.

After any call, someone posts a 2 to 3 line summary on the related issue, so the written record stays
complete for whoever was not there.

## Branches, commits and pull requests

1. Move your card to **In Progress** (check the WIP limit first).
2. Branch from `main`: `<issue-number>-short-name`, for example `3-double-booking`.
3. Commit in small steps with clear messages (`fix: ...`, `feat: ...`, `test: ...`, `docs: ...`).
4. Run `npm test` before pushing.
5. Open a PR, fill in the template (it starts with `Closes #N`), and request your reviewer from the
   rotation. Move the card to **Code Review**.
6. Reviewers: first review within **24 hours**. A review comes before starting new work.
7. After approval, the card goes to **Verification**. The verifier checks each acceptance criterion and
   comments on the issue. Then merge, and the card goes to **Done**.

## Labels

| Label | Use |
|---|---|
| `type: feature`, `type: defect`, `type: maintenance`, `type: technical` | Kind of work item |
| `type: incident` | Production incident (gets a Five Whys) |
| `type: experiment` | Process-improvement experiment |
| `priority: P1` | Affects patients or clinics now, or is committed for this cycle |
| `priority: P2` | Should ship this cycle if the WIP limits allow |
| `priority: P3` | Can wait for the next cycle |
| `blocked` | Cannot move until something else happens (say what in a comment) |
| `needs info` | Not Ready: open questions remain |
| `support` | A request from a clinic (production support) |
| `process` | How we work: updates, objectives, rules |

## Running the prototype

You need Node.js 20 or newer. There are no dependencies to install.

```bash
git clone https://github.com/karmidd/medilink-team28.git
cd medilink-team28
npm test
```

| File | What it does |
|---|---|
| `src/store.js` | In-memory sample data: clinics, patients, time slots, appointments, reminder queue |
| `src/appointments.js` | Book, cancel and reschedule appointments; list free slots |
| `src/reminders.js` | Queue reminders and send the ones that are due |
| `src/format.js` | Format appointment times for emails and reminders |
| `tests/` | One test file per source file (`node --test`) |

### Test results

GitHub Actions runs `npm test` on every pull request to `main` and every push to `main`
(`.github/workflows/test.yml`). The result shows as the **Tests** check at the bottom of each PR, and
the full log is in the [Actions tab](https://github.com/karmidd/medilink-team28/actions). A PR cannot be
merged until the check passes and a teammate has approved it.
