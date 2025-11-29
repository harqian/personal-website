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

  function next() {
    if (items.length === 0) return;
    current = (current + 1) % items.length;
  }

  function prev() {
    if (items.length === 0) return;
    current = (current - 1 + items.length) % items.length;
  }

  function start() {
    if (!autoplay || items.length <= 1) return;
    stop();
    timer = setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
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

<div class="carousel" on:mouseenter={stop} on:mouseleave={start}>
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

    {#if showArrows && items.length > 1}
      <button class="nav prev" on:click={prev} aria-label="Previous">
        <i class="fa fa-chevron-left"></i>
      </button>
      <button class="nav next" on:click={next} aria-label="Next">
        <i class="fa fa-chevron-right"></i>
      </button>
    {/if}

    {#if showDots && items.length > 1}
      <div class="dots">
        {#each items as _, i}
          <button class="dot {i === current ? 'active' : ''}" on:click={() => current = i} aria-label={`Go to slide ${i+1}`}></button>
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

  @media (max-width: 768px) {
    .nav { width: 30px; height: 30px; }
  }
</style>
