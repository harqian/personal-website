---
date: 2026-03-28T22:17:04-0700
git_commit: f3905df92c32f7ffe9f0d7a4e22039165edaef6a
branch: main
topic: "Carousel Skip Debugging Implementation Strategy"
tags: [implementation, strategy, carousel, svelte, homepage]
status: complete
---

# Handoff: carousel skip debugging

## Task(s)
- Investigate and simplify the homepage carousel interaction model in `src/lib/Carousel.svelte`. Status: partially completed.
- Compare current carousel behavior against common UX patterns. Status: completed earlier in session; conclusion was to simplify to image/caption/timer + click-to-advance + dots only.
- Debug reports that the carousel was skipping slides. Status: in progress, with several concrete fixes already landed.
- Current phase: bugfix/verification. The remaining issue is that the user still reports some later slides being skipped even after the first known bug was fixed.

## Critical References
- `/Users/hq/github_projects/personal-website/src/lib/Carousel.svelte`
- `/Users/hq/github_projects/personal-website/src/lib/assets/carouselDurations.json`
- `/Users/hq/github_projects/personal-website/src/routes/+page.svelte`

## Recent changes
- Simplified carousel controls in `/Users/hq/github_projects/personal-website/src/lib/Carousel.svelte:23-99,176-258`
  - removed hover-pause behavior
  - removed arrow navigation
  - made the viewport itself clickable and keyboard-activatable
  - kept dots only, moved them to the top-left
  - added hover scale/pointer treatment
- Tightened timer logic in `/Users/hq/github_projects/personal-website/src/lib/Carousel.svelte:46-67,148-172`
  - `start()` now tries to use actual loaded video duration when `duration` is `null`
  - `startWithDuration()` now supports `resumeFrom`
  - `stop()` only clears `setTimeout` and animation frame
- Removed duplicate video advance path in `/Users/hq/github_projects/personal-website/src/lib/Carousel.svelte:192-199`
  - deleted `on:ended={...}` from `<video>` because video slides were previously advancing via both timeout and `ended`
- Corrected stale duration/caption metadata in `/Users/hq/github_projects/personal-website/src/lib/assets/carouselDurations.json:2-14`
  - changed `2_mongodb.webm` from `duration: null` to `duration: 3000`
  - replaced nonexistent `3_manus.JPG` entry with real `3_oncue.png`
  - added real `manus.JPG`
  - removed nonexistent `oncue.webp`

## Learnings
- The homepage carousel is only driven from `src/routes/+page.svelte` into `src/lib/Carousel.svelte`; there is no hidden second implementation for the homepage.
- The asset order in `src/routes/+page.svelte:12-17` comes from `import.meta.glob(...).sort(localeCompare)`. The actual sorted assets are:
  - `1_juggling.webm`
  - `2_mongodb.webm`
  - `3_oncue.png`
  - `4_ukulele.jpg`
  - `5_dumb.webp`
  - then the unnumbered files alphabetically
- One real root cause was confirmed:
  - `2_mongodb.webm` previously had `duration: null`, so it used the real media duration
  - `ffprobe` showed it was only `1.585s`
  - the old code also advanced video slides on `ended`, so slide 2 had two independent `next()` paths
- A second repo-level issue was also confirmed:
  - `src/lib/assets/carouselDurations.json` had drifted from the actual filenames in `src/lib/assets/carousel_media`
  - this made some slides captionless / misleading and made debugging via labels harder
- Important debugging caveat:
  - `agent-browser snapshot` was not a reliable source of truth for the active slide caption once videos/captionless slides were involved
  - after clicking from slide 1, the snapshot sometimes reported the label `oncue — eeg research` or `ukulele`, but that did not conclusively prove the visible active slide index
  - next session should use an explicit temporary on-screen debug label for `current` index and filename rather than infer state from the accessibility tree

## Artifacts
- `/Users/hq/github_projects/personal-website/src/lib/Carousel.svelte`
- `/Users/hq/github_projects/personal-website/src/lib/assets/carouselDurations.json`
- `/Users/hq/github_projects/personal-website/src/routes/+page.svelte`
- `/Users/hq/github_projects/personal-website/handoffs/2026-03-28_22-17-04_carousel-skip-debug.md`

## Action Items & Next Steps
- Add a temporary visible debug overlay to the carousel showing:
  - `current` index
  - current filename
  - current caption
  - current duration
- Reproduce the reported later-slide skips in a browser with that overlay visible.
- Verify whether any remaining skip is:
  - a real double increment of `current`
  - a render/caption mismatch
  - a timer restart issue caused by the reactive autoplay block in `src/lib/Carousel.svelte:94-99`
- Strong next suspect if the skip persists:
  - the reactive `$: if (autoplay) start();` block at `src/lib/Carousel.svelte:94-99`
  - even though it was not conclusively proven as the culprit in this session, it still centralizes timer restarts in a way that is difficult to reason about
- After debugging, remove the temporary overlay before finishing.

## Other Notes
- Build verification passed after the changes: `npm run build`.
- Browser verification used a local `vite` dev server started in `tmux` and `agent-browser` for page open/click/snapshot checks.
- Do not trust the browser accessibility snapshot alone for active-slide identification on this component.
- If continuing the debug, prefer:
  1. add explicit on-screen state
  2. reproduce
  3. only then refactor more timer logic
