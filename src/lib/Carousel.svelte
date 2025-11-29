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
  /** @type {boolean} */
  export let showArrows = true;

  let current = 0;
  let timer = null;
  let videoElements = [];
  let isHovered = false;
  let progress = 0;
  let progressTimer = null;
  let startTime = 0;
  let pausedProgress = 0;

  function next() {
    if (items.length === 0) return;
    current = (current + 1) % items.length;
    resetProgress();
  }

  function prev() {
    if (items.length === 0) return;
    current = (current - 1 + items.length) % items.length;
    resetProgress();
  }

  function nextManual() {
    next();
    pausedProgress = 0;
    start(0);
  }

  function prevManual() {
    prev();
    pausedProgress = 0;
    start(0);
  }

  function goToSlide(index) {
    current = index;
    resetProgress();
    pausedProgress = 0;
    start(0);
  }

  function resetProgress() {
    startTime = Date.now();
    progress = 0;
    updateProgress();
  }

  function updateProgress() {
    if (isHovered || !autoplay || items.length <= 1) return;
    if (typeof requestAnimationFrame === 'undefined') return;

    const elapsed = Date.now() - startTime;
    progress = Math.min((elapsed / intervalMs) * 100, 100);

    if (progress < 100) {
      progressTimer = requestAnimationFrame(updateProgress);
    }
  }

  function start(resumeFrom = 0) {
    if (!autoplay || items.length <= 1) return;
    stop();

    const remainingTime = intervalMs * (1 - resumeFrom / 100);
    startTime = Date.now() - (intervalMs * resumeFrom / 100);
    progress = resumeFrom;

    if (resumeFrom === 0 || resumeFrom >= 100) {
      timer = setInterval(next, intervalMs);
    } else {
      timer = setTimeout(() => {
        next();
        timer = setInterval(next, intervalMs);
      }, remainingTime);
    }

    updateProgress();
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      clearTimeout(timer);
      timer = null;
    }
    if (progressTimer && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(progressTimer);
      progressTimer = null;
    }
  }

  function handleMouseEnter() {
    isHovered = true;
    pausedProgress = progress;
    stop();
  }

  function handleMouseLeave() {
    isHovered = false;
    start(pausedProgress);
  }

  onMount(start);
  onDestroy(stop);

  $: if (autoplay) {
    // restart when items or interval changes
    start();
  } else {
    stop();
  }

  $: {
    // Control video playback based on active slide
    videoElements.forEach((video, i) => {
      if (video) {
        if (i === current) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }

  function isVideo(path) {
    return /\.(webm|mp4|mov)$/i.test(path);
  }

  function encoded(path) {
    return encodeURI(path);
  }
</script>

<div class="carousel" role="region" aria-label="Image carousel" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
  {#if items && items.length > 0}
    <div class="viewport">
      {#each items as item, i}
        <div class="slide {i === current ? 'active' : ''}" aria-hidden={i === current ? 'false' : 'true'}>
          {#if isVideo(item)}
            <video bind:this={videoElements[i]} src={encoded(item)} muted loop playsinline></video>
          {:else}
            <img src={encoded(item)} alt="" />
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

    {#if showArrows && items.length > 1}
      <button class="nav prev" on:click={prevManual} aria-label="Previous">
        <i class="fa fa-chevron-left"></i>
      </button>
      <button class="nav next" on:click={nextManual} aria-label="Next">
        <i class="fa fa-chevron-right"></i>
      </button>
    {/if}

    {#if showDots && items.length > 1}
      <div class="dots">
        {#each items as _, i}
          <button class="dot {i === current ? 'active' : ''}" on:click={() => goToSlide(i)} aria-label={`Go to slide ${i+1}`}></button>
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
  }

  .viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
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

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.35);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 999px;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    cursor: pointer;
    z-index: 2;
  }
  .nav:hover { background: rgba(0,0,0,0.5); }
  .nav.prev { left: 8px; }
  .nav.next { right: 8px; }

  .dots {
    position: absolute;
    left: 0; right: 0; bottom: 8px;
    display: flex;
    gap: 6px;
    justify-content: center;
    z-index: 2;
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

  @media (max-width: 768px) {
    .nav { width: 30px; height: 30px; }
    .timer-indicator { top: 8px; right: 8px; }
  }
</style>
