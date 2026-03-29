<script>
  import { onMount, onDestroy } from 'svelte';

  /** @type {string[]} */
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
  let progress = 0;
  let progressTimer = null;
  let startTime = 0;
  let currentDuration = intervalMs;
  let prevAutoplay = autoplay;

  function next() {
    if (items.length === 0) return;
    current = (current + 1) % items.length;
    start(0);
  }

  function goToSlide(index) {
    current = index;
    start(0);
  }

  function updateProgress() {
    if (!autoplay || items.length <= 1) return;
    if (typeof requestAnimationFrame === 'undefined') return;

    const elapsed = Date.now() - startTime;
    progress = Math.min((elapsed / currentDuration) * 100, 100);

    if (progress < 100) {
      progressTimer = requestAnimationFrame(updateProgress);
    }
  }

  function start(resumeFrom = 0) {
    if (!autoplay || items.length <= 1) return;
    stop();

    const itemDuration = getDurationForItem(current);
    if (itemDuration === null) {
      const video = videoElements[current];
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        startWithDuration(video.duration * 1000, resumeFrom);
      }
      return;
    }
    currentDuration = itemDuration;

    const remainingTime = currentDuration * (1 - resumeFrom / 100);
    startTime = Date.now() - (currentDuration * resumeFrom / 100);
    progress = resumeFrom;

    // use setTimeout instead of setInterval since each slide has different duration
    timer = setTimeout(next, remainingTime);
    updateProgress();
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (progressTimer && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(progressTimer);
      progressTimer = null;
    }
  }

  function handleCarouselClick() {
    next();
  }

  function handleCarouselKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      next();
    }
  }

  onMount(start);
  onDestroy(stop);

  $: {
    // only react to autoplay toggling, not to current/items changes
    const ap = autoplay;
    if (ap !== prevAutoplay) {
      prevAutoplay = ap;
      if (ap) {
        start();
      } else {
        stop();
      }
    }
  }

  $: {
    // Control video playback based on active slide
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

  function isVideo(path) {
    return /\.(webm|mp4|mov)$/i.test(path);
  }

  function encoded(path) {
    return encodeURI(path);
  }

  // extract filename from path like "/src/lib/assets/carousel_media/1_juggling.webm"
  function getFilename(path) {
    return path.split('/').pop();
  }

  // get duration for current item - returns ms, or null for "use video length"
  function getDurationForItem(index) {
    if (index < 0 || index >= items.length) return intervalMs;
    const item = items[index];
    const filename = getFilename(item);
    const config = durations[filename];
    const specifiedDuration = typeof config === 'number' ? config : config?.duration;

    if ((specifiedDuration === null || specifiedDuration === 'length') && isVideo(item)) {
      return null;
    }
    if (typeof specifiedDuration === 'number') return specifiedDuration;
    return intervalMs;
  }

  function getCaptionForItem(index) {
    if (index < 0 || index >= items.length) return '';
    const filename = getFilename(items[index]);
    const config = durations[filename];
    return config?.caption || '';
  }

  function handleVideoLoaded(event, index) {
    if (index !== current) return;
    const video = event.target;
    const filename = getFilename(items[index]);

    const config = durations[filename];
    const specifiedDuration = typeof config === 'number' ? config : config?.duration;
    if (specifiedDuration === null || specifiedDuration === undefined || specifiedDuration === 'length') {
      currentDuration = video.duration * 1000;
      if (autoplay) {
        stop();
        startWithDuration(currentDuration);
      }
    }
  }

  function startWithDuration(duration, resumeFrom = 0) {
    if (!autoplay || items.length <= 1) return;
    stop();
    currentDuration = duration;
    const remainingTime = currentDuration * (1 - resumeFrom / 100);
    startTime = Date.now() - (currentDuration * resumeFrom / 100);
    progress = resumeFrom;
    timer = setTimeout(next, remainingTime);
    updateProgress();
  }
</script>

<div
  class="carousel"
  role="region"
  aria-label="Image carousel"
>
  {#if items && items.length > 0}
    <div
      class="viewport"
      role="button"
      tabindex="0"
      aria-label="Advance to next slide"
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
              on:loadedmetadata={(e) => handleVideoLoaded(e, i)}
            ></video>
          {:else}
            <img src={encoded(item)} alt="" />
          {/if}
          {#if getCaptionForItem(i)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="caption" on:click|stopPropagation>{@html getCaptionForItem(i)}</div>
          {/if}
        </div>
      {/each}
    </div>

    {#if items.length > 1}
      <div class="timer-indicator">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            stroke-width="2"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            stroke-width="2"
            stroke-dasharray="87.96"
            stroke-dashoffset={87.96 - (87.96 * progress / 100)}
            transform="rotate(-90 16 16)"
          />
        </svg>
      </div>
    {/if}

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

  .timer-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    pointer-events: none;
    opacity: 0.7;
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
    .timer-indicator { top: 8px; right: 8px; }
    .caption { font-size: 0.75rem; padding: 4px 8px; }
  }
</style>
