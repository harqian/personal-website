<script>
  import { onMount, onDestroy, tick } from 'svelte';

  /**
   * @typedef {{name: string, src: string}} CarouselItem
   */

  /** @type {CarouselItem[]} */
  export let items = [];
  /** @type {number} */
  export let intervalMs = 4000;
  /** @type {boolean} */
  export let autoplay = true;
  /** @type {boolean} */
  export let showDots = true;
  /** @type {Object.<string, {duration: number|null, caption?: string}>} - maps filename to config */
  export let durations = {};

  let current = 0;
  let timer = null;
  let videoElements = [];
  let isMuted = true;
  let startTime = 0;
  let currentDuration = intervalMs;
  let prevAutoplay = autoplay;
  let paused = false;
  let pausedElapsed = 0;
  // tracks the slide whose video has been activated, so the slide-change
  // reactive block doesn't reset video.currentTime on pause toggles
  let lastActivated = -1;
  // client-only render: avoids hydration mismatches when browser extensions
  // mutate the carousel's video nodes (e.g. youtube playback-rate controllers)
  let mounted = false;

  // spin-to-item: turns the carousel like a wheel toward a target slide,
  // sliding past the intermediate items and decelerating into the landing
  let spinning = false;   // strip is laid out horizontally (vs normal crossfade)
  let spinAnim = false;   // transform transition is armed
  let settling = false;   // one instant frame to hand back to crossfade (no flash)
  let spinMs = 0;
  let spinTimer = null;
  let landed = false;     // brief ring pulse on the slide we land on
  let landedTimer = null;
  let reduceMotion = false;
  let viewportEl;
  let copied = false;
  let copiedTimer = null;
  // strong ease-out, NO overshoot — settles cleanly into the target
  const SPIN_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  function indexForSlug(slug) {
    if (!slug) return -1;
    return items.findIndex((it) => durations[it.name]?.slug === slug);
  }
  function slugForIndex(i) {
    return durations[items[i]?.name]?.slug || null;
  }

  function pulseLanding() {
    landed = true;
    clearTimeout(landedTimer);
    landedTimer = setTimeout(() => (landed = false), 1100);
  }

  function restartCurrent() {
    const v = videoElements[current];
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }

  // public: spin the carousel to the item with this slug
  export async function spinTo(slug, { instant = false } = {}) {
    const idx = indexForSlug(slug);
    if (idx < 0) return;
    stop();
    paused = false;
    if (idx === current) {
      // already on it — replay from the top instead of doing nothing
      restartCurrent();
      pulseLanding();
      startSlide(0);
      return;
    }
    if (instant || reduceMotion || items.length <= 1) {
      current = idx;
      pulseLanding();
      startSlide(0);
      return;
    }
    const dist = Math.abs(idx - current);
    spinMs = Math.min(1500, 450 + dist * 70);
    // 1) lay the strip out at the CURRENT position with no transition (instant)
    spinning = true;
    spinAnim = false;
    await tick();
    // 2) commit that layout, then arm the transition and move to the target
    if (viewportEl) void viewportEl.offsetWidth; // force reflow
    spinAnim = true;
    current = idx;
    await tick();
    clearTimeout(spinTimer);
    spinTimer = setTimeout(async () => {
      // hand back to crossfade in ONE instant frame: the off-screen neighbors
      // snap from ±100% to center, but with transitions off so they don't
      // fade through the target (that was the end-of-spin flash)
      settling = true;
      spinning = false;
      spinAnim = false;
      await tick();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => (settling = false));
      });
      pulseLanding();
      startSlide(0);
    }, spinMs);
  }

  async function copyLink() {
    const slug = slugForIndex(current);
    if (!slug) return;
    const url = `${location.origin}/#vibe=${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for non-secure contexts / older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copied = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied = false), 1500);
  }

  function next() {
    if (items.length === 0) return;
    current = (current + 1) % items.length;
    paused = false;
    startSlide(0);
  }

  function prev() {
    if (items.length === 0) return;
    current = (current - 1 + items.length) % items.length;
    paused = false;
    startSlide(0);
  }

  function goToSlide(index) {
    current = index;
    paused = false;
    startSlide(0);
  }

  function startSlide(elapsedMs = 0, minRemainingMs = 0) {
    if (!autoplay || items.length <= 1 || paused) return;
    stop();

    const itemDuration = getDurationForItem(current);
    if (itemDuration === null) {
      // length-driven video: advance is triggered by the 'ended' event,
      // not a timer. nothing to schedule here.
      startTime = Date.now() - elapsedMs;
      currentDuration = 0;
      return;
    }
    currentDuration = itemDuration;

    startTime = Date.now() - elapsedMs;
    // minRemainingMs cushions the timer for the resume case so pausing near
    // the end of a slide doesn't cause an immediate jump on resume
    const remainingTime = Math.max(minRemainingMs, currentDuration - elapsedMs, 0);
    timer = setTimeout(next, remainingTime);
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function togglePause() {
    if (items.length <= 1) return;
    if (paused) {
      paused = false;
      const video = videoElements[current];
      if (video) video.play().catch(() => {});
      startSlide(pausedElapsed, 500);
    } else {
      paused = true;
      pausedElapsed = Date.now() - startTime;
      stop();
      const video = videoElements[current];
      if (video) video.pause();
    }
  }

  function handleCarouselClick() {
    togglePause();
  }

  function handleCarouselKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePause();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    }
  }

  onMount(() => {
    mounted = true;
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startSlide();
  });
  onDestroy(() => {
    stop();
    clearTimeout(spinTimer);
    clearTimeout(landedTimer);
    clearTimeout(copiedTimer);
  });

  $: {
    // only react to autoplay toggling, not to current/items changes
    const ap = autoplay;
    if (ap !== prevAutoplay) {
      prevAutoplay = ap;
      if (ap) {
        startSlide();
      } else {
        stop();
      }
    }
  }

  $: if (current !== lastActivated && videoElements.length > 0) {
    // only activate when current changes — avoids resetting currentTime on pause
    lastActivated = current;
    for (const [i, video] of videoElements.entries()) {
      if (!video) continue;
      if (i === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }

  function isVideo(item) {
    return /\.(webm|mp4|mov)$/i.test(item?.src || '');
  }

  function encoded(item) {
    return encodeURI(item.src);
  }

  // get duration for current item - returns ms, or null for "use video length"
  function getDurationForItem(index) {
    if (index < 0 || index >= items.length) return intervalMs;
    const item = items[index];
    const config = durations[item.name];
    const specifiedDuration = typeof config === 'number' ? config : config?.duration;

    if ((specifiedDuration === null || specifiedDuration === 'length') && isVideo(item)) {
      return null;
    }
    if (typeof specifiedDuration === 'number') return specifiedDuration;
    return intervalMs;
  }

  function getCaptionForItem(index) {
    if (index < 0 || index >= items.length) return '';
    const config = durations[items[index].name];
    return config?.caption || '';
  }

  function getObjectPositionForItem(index) {
    if (index < 0 || index >= items.length) return '';
    const config = durations[items[index].name];
    return config?.objectPosition || '';
  }

  function toggleMute() {
    isMuted = !isMuted;
    for (const v of videoElements) {
      if (v) v.muted = isMuted;
    }
    const v = videoElements[current];
    if (v && !isMuted) v.play().catch(() => {});
  }

  function handleVideoEnded(index) {
    if (index !== current || paused) return;
    if (getDurationForItem(index) !== null) return;
    next();
  }
</script>

<div
  class="carousel"
  role="region"
  aria-label="Image carousel"
>
  {#if mounted && items && items.length > 0}
    <div
      class="viewport"
      class:spinning
      bind:this={viewportEl}
      role="button"
      tabindex="0"
      aria-label="Click to pause or resume; arrow keys to navigate"
      on:click={handleCarouselClick}
      on:keydown={handleCarouselKeydown}
    >
      {#each items as item, i}
        <div
          class="slide {i === current ? 'active' : ''}"
          class:spin={spinning}
          class:landed={landed && i === current}
          style:transform={spinning ? `translateX(${(i - current) * 100}%)` : null}
          style:transition={spinning ? (spinAnim ? `transform ${spinMs}ms ${SPIN_EASE}` : 'none') : (settling ? 'none' : null)}
          aria-hidden={i === current ? 'false' : 'true'}
        >
          {#if isVideo(item)}
            <video
              bind:this={videoElements[i]}
              src={encoded(item)}
              muted={isMuted}
              playsinline
              style:object-position={getObjectPositionForItem(i) || null}
              on:ended={() => handleVideoEnded(i)}
            ></video>
          {:else}
            <img src={encoded(item)} alt="" style:object-position={getObjectPositionForItem(i) || null} />
          {/if}
          {#if getCaptionForItem(i)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="caption" on:click|stopPropagation>{@html getCaptionForItem(i)}</div>
          {/if}
        </div>
      {/each}

      <button
        class="mute-toggle"
        on:click|stopPropagation={toggleMute}
        aria-label={isMuted ? 'unmute carousel' : 'mute carousel'}
        aria-pressed={!isMuted}
      >
        {#if isMuted}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M3 10v4h4l5 4V6L7 10H3z" fill="white"/>
            <path d="M16 8l5 8M21 8l-5 8" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M3 10v4h4l5 4V6L7 10H3z" fill="white"/>
            <path d="M16 8c1.5 1 2 2.5 2 4s-.5 3-2 4M19 5c2.5 1.5 3.5 4 3.5 7s-1 5.5-3.5 7" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
        {/if}
      </button>

      <button
        class="copy-link {copied ? 'copied' : ''}"
        on:click|stopPropagation={copyLink}
        aria-label="copy a link to this carousel item"
      >
        {#if copied}
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          copied
        {:else}
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M9 15l6-6M11 6l1-1a4 4 0 015.5 5.5l-1 1M13 18l-1 1A4 4 0 016.5 13.5l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          copy link
        {/if}
      </button>

      {#if paused}
        <div class="pause-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5v14l11-7z" fill="white" />
          </svg>
        </div>
      {/if}

      {#if items.length > 1}
        <button
          class="nav-arrow nav-prev"
          on:click|stopPropagation={prev}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          class="nav-arrow nav-next"
          on:click|stopPropagation={next}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      {/if}
    </div>

    {#if showDots && items.length > 1}
      <div class="dots">
        {#each items as _, i}
          <button
            class="dot {i === current ? 'active' : ''}"
            on:click|stopPropagation={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .carousel {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: transform 220ms ease;
    transform-origin: center;
  }

  .carousel:hover {
    transform: scale(1.04);
  }

  .viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    outline: none;
  }

  .viewport:focus-visible {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.7);
  }

  .slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 400ms ease;
    display: grid;
    place-items: center;
    background: var(--surface-1);
  }
  .slide.active {
    opacity: 1;
  }
  /* during a spin the slides sit in a horizontal strip and are all visible
     so you see the intermediate items turn past */
  .slide.spin {
    opacity: 1;
    will-change: transform;
  }
  /* the viewport keeps the strip clipped to one item while it turns */
  .viewport.spinning .slide {
    backface-visibility: hidden;
  }
  .slide.landed::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    box-shadow: inset 0 0 0 3px rgba(var(--accent-yellow-rgb), 0.9);
    animation: landed-pulse 1.1s ease-out forwards;
    pointer-events: none;
    z-index: 2;
  }
  @keyframes landed-pulse {
    0% { opacity: 0; }
    18% { opacity: 1; }
    100% { opacity: 0; }
  }

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .dots {
    position: absolute;
    top: 12px;
    left: 0;
    right: 0;
    padding: 0 12px;
    display: flex;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
    z-index: 3;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.2);
    cursor: pointer;
  }
  .dot.active { background: rgba(255,255,255,0.9); }

  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 56px;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.35);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    opacity: 0.55;
    transition: opacity 160ms ease, background 160ms ease;
    z-index: 4;
    padding: 0;
  }
  .nav-arrow:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.6);
  }
  .nav-arrow:focus-visible {
    opacity: 1;
    outline: 2px solid rgba(255, 255, 255, 0.9);
    outline-offset: 2px;
  }
  .nav-prev { left: 8px; }
  .nav-next { right: 8px; }

  .mute-toggle {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.45);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 160ms ease, background 160ms ease;
    z-index: 4;
    padding: 0;
  }
  .mute-toggle:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.7);
  }
  .mute-toggle:focus-visible {
    opacity: 1;
    outline: 2px solid rgba(255, 255, 255, 0.9);
    outline-offset: 2px;
  }

  .copy-link {
    position: absolute;
    top: 8px;
    left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 26px;
    padding: 0 10px;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.95);
    background: rgba(0, 0, 0, 0.45);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 160ms ease, transform 160ms ease, background 160ms ease;
    z-index: 5;
  }
  .viewport:hover .copy-link,
  .copy-link:focus-visible {
    opacity: 0.85;
    transform: translateY(0);
  }
  .copy-link:hover { opacity: 1; background: rgba(0, 0, 0, 0.7); }
  .copy-link:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.9); outline-offset: 2px; }
  .copy-link.copied { opacity: 1; color: var(--accent-yellow); background: rgba(0, 0, 0, 0.65); }

  .pause-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.55);
    display: grid;
    place-items: center;
    pointer-events: none;
    z-index: 3;
    animation: pause-fade-in 160ms ease;
  }
  .pause-overlay svg {
    /* nudge play triangle to feel optically centered in the circle */
    transform: translateX(2px);
  }

  @keyframes pause-fade-in {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .caption {
    position: absolute;
    bottom: 28px;
    left: 0;
    right: 0;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.85rem;
    text-align: center;
    z-index: 1;
  }
  .caption :global(a) {
    color: inherit;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .carousel:hover {
      transform: scale(1.02);
    }
    .dots {
      top: 8px;
      padding: 0 8px;
    }
    .caption { font-size: 0.75rem; padding: 4px 8px; }
  }
</style>
