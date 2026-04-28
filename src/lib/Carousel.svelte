<script>
  import { onMount, onDestroy } from 'svelte';

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
    startSlide();
  });
  onDestroy(stop);

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
      role="button"
      tabindex="0"
      aria-label="Click to pause or resume; arrow keys to navigate"
      on:click={handleCarouselClick}
      on:keydown={handleCarouselKeydown}
    >
      {#each items as item, i}
        <div class="slide {i === current ? 'active' : ''}" aria-hidden={i === current ? 'false' : 'true'}>
          {#if isVideo(item)}
            <video
              bind:this={videoElements[i]}
              src={encoded(item)}
              muted
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
    background: rgba(255,255,255,0.03);
  }
  .slide.active {
    opacity: 1;
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
    left: 12px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    z-index: 3;
    max-width: calc(100% - 64px);
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
      left: 8px;
      max-width: calc(100% - 48px);
    }
    .caption { font-size: 0.75rem; padding: 4px 8px; }
  }
</style>
