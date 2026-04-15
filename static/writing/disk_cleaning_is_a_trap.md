---
title: "disk cleaning is a trap"
date: "2026-04-15"
tags:
    - macos
    - tools
    - productivity
published: true
---

the first time you clean your Mac, it's exhilarating. you open storage settings, discover 40GB of stuff you forgot existed — old apps, abandoned downloads, an ML project with its entire training dataset still embedded — and start deleting. the storage bar moves. you delete more. it moves again. this is the fastest feedback loop in personal computing: action, result, dopamine, repeat.

it is also a trap.

i've cleaned the same MacBook six times now. the first round was genuinely useful — i reclaimed something like 80GB. the second found maybe 30GB more. by the fifth or sixth, i was spending an hour grinding through system directories to claw back 3GB of cache files that would regenerate by the end of the week.

here's what i eventually figured out.

## the distinction that changes everything

not all disk junk is equal, and failing to see the difference is what makes most cleaning a waste of time.

**recurring garbage**: caches, logs, APFS purgeable space, temp files. you clean them, and they come back. always. through normal use, your system regenerates this stuff within days. worse: caches exist because they make your computer faster. deleting them is borrowing space from your future self and paying interest in performance.

**permanent waste**: apps you don't use, projects you finished, downloads you forgot about. delete these and the space is yours forever — or at least until you choose to reinstall something.

here's the thing about cleaning tools: almost all of them focus on the first category. not because it's more valuable — it's objectively less valuable — but because it's automatable, it produces impressive-looking numbers, and, if you want the cynical read, it guarantees you'll need to run the tool again next month.

the three-month rule cuts through all of this. if you haven't opened something in three months, delete it. i've applied this dozens of times. never once regretted a deletion. the anxiety of "but what if i need it" is almost always unfounded — and if you do need it, you re-download. in practice, you won't.

## some free tools

i tested six free tools. most disappointed me, but for specific reasons worth understanding.

**the three i'd recommend to anyone:**

**OmniDiskSweeper** scans your whole disk and shows everything sorted by size. no automation, no "smart cleaning," no opinions about what to delete. just a ranked view of what's eating your space. freeware from The Omni Group. the fastest way to understand your disk.

**Finder** — the one already on your computer — does the same thing with one critical addition: dates. switch to List View, ⌘J, enable "Calculate all sizes," add "Date Last Opened." now you can sort by size *and* see when you last touched each file. that combination — how big, how stale — is all you need to apply the three-month rule. Finder chokes on mounted drives like Google Drive and sometimes silently skips folders, but when it works, it's the best tool available, and you didn't have to install anything.

**Mole** (open-source CLI, `mo analyze` / `mo clean`): disk explorer that works but scans synchronously — you sit there waiting. no background indexing. cache cleaning is recurring garbage by definition.

between these three, a first-time cleaner can find 20–50GB in thirty minutes.

**the other three:**

**Pearcleaner**: ~10 tabs, strongest for cleanly uninstalling apps with their scattered config files. has a developer section that's conspicuously missing `node_modules`, which is baffling — it's one of the single largest space hogs on any JS developer's machine.

**PureMac**: identifies APFS purgeable space, which sounds useful until you realize the OS already purges this automatically when you're low on disk. you're solving a problem macOS solves for you.

**OnyX**: recommended constantly, but i found it confusing. the interface doesn't explain what its maintenance routines do. its cleaning features told me nothing new. one genuinely useful accident: a maintenance restart re-triggered macOS's gatekeeper check on my apps, which revealed that ChatGPT desktop was silently launching as a background process every time i booted my Mac. i had no idea. i didn't want that. OnyX earned its keep as an accidental startup auditor.

## where you look matters more than which tool you use

the first time, your home directory is full of obvious waste. downloads, unused apps, old projects. easy.

after a few rounds, home is clean. everything left is active work or would be annoying to lose. the marginal gain is a few gigs of cache in `~/Library` that comes back in a week.

at that point, the only meaningful gains are in system directories — `/Library`, `/System`, `/usr/local`. large files whose purpose is unclear. developer tool caches, old runtime versions, things Homebrew installed three macOS versions ago. real space here. real risk too — delete the wrong thing and you're reinstalling Xcode.

and this is exactly where the trap bites hardest. you're navigating directories you barely understand, the files are getting smaller, the stakes per deletion are rising, and the loop is still pulling you forward. set a target before you start — 10GB, 50GB, whatever — and walk away when you hit it.

## LLMs as research, not discovery

something that works surprisingly well for those ambiguous system files: asking an agent.

you find a 4GB directory in `/Library/Developer/CoreSimulator/`. you don't know if it matters. hand the path to Claude Code: *what is this, is it safe to delete, what breaks if i do?* for this specific question — "is this file important?" — LLMs are fast, thorough, and usually right.

what they cannot do is discover what to clean. "find stuff to delete on my Mac" produces terrible results. the model has no context for what matters to you, so it flags your largest files — active projects you care about — as suspicious. big = bad is the only heuristic it has without guidance.

the right pairing: dumb tools for scanning, smart tools for judgment. discovery and evaluation are different skills.

## the actual answer

most of the time, the three-month rule plus Finder is enough. you don't need a tool. you need the willingness to delete things.

for power users who've exhausted the obvious wins, OmniDiskSweeper for discovery and an LLM for research handles the ambiguous system-level stuff.

and if a few big projects account for 80% of your disk and everything else is already lean, you don't have a cleaning problem. you have a storage problem. move a project to an external drive. two minutes.

the hardest part of disk cleaning isn't finding things to delete. it's recognizing when you've crossed from productivity into compulsion, and closing the window.
