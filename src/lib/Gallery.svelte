<script>
    // ##########################
    // CREDIT: Claude 3.7, ChatGPT, and https://github.com/BerkinAKKAYA/svelte-image-gallery
    // ##########################
    import { onMount, createEventDispatcher } from "svelte"

    /**
     * @type {string[]} - Array of image paths
     */
    export let images = []

    /**
     * @type {number}
     */
    export let gap = 10

    /**
     * @type {number}
     */
    export let maxColumnWidth = 250

    /**
     * @type {boolean}
     */
    export let hover = false

    /**
     * @type {'eager' | 'lazy'}
     */
    export let loading = "eager"

    const dispatch = createEventDispatcher()

    /**
     * @type {number}
     */
    let galleryWidth = 0

    /**
     * @type {number}
     */
    let columnCount = 0

    /**
     * @type {string[][]}
     */
    let columns = []

    /**
     * @type {Set<string>}
     */
    let clickedImages = new Set()

    /** @type {Object<string, HTMLVideoElement>} */
    let videoEls = {};

    /** @type {string | null} */
    let unmutedVideo = null;

    function isVideoPath(p) {
        return /\.(webm|mp4|mov)$/i.test(p);
    }

    function setUnmuted(path) {
        unmutedVideo = (unmutedVideo === path) ? null : path;
        for (const [p, el] of Object.entries(videoEls)) {
            if (!el) continue;
            const shouldMute = unmutedVideo !== p;
            el.muted = shouldMute;
            if (!shouldMute) el.play().catch(() => {});
        }
    }

    function handleClick(path, event) {
        // zoom-on-hover toggle (only meaningful when multi-column)
        if (columnCount !== 1) {
            if (clickedImages.has(path)) {
                clickedImages.delete(path);
            } else {
                clickedImages.add(path);
            }
            clickedImages = clickedImages;
        }

        // for videos: toggle audio (one-at-a-time)
        if (isVideoPath(path)) {
            setUnmuted(path);
        }

        dispatch("click", { path });
    }

    function handleMouseLeave(path, event) {
        if (clickedImages.has(path)) {
            clickedImages.delete(path)
        }
        clickedImages = clickedImages;
    }

    // Calculate column count based on gallery width and max column width
    $: columnCount = Math.max(1, Math.floor(galleryWidth / maxColumnWidth));

    // Only reorganize columns when necessary
    $: if (columnCount > 0 && images.length > 0) {
        // Create new columns only when count changes
        columns = Array.from({ length: columnCount }, () => []);
        
        // Fill columns with even distribution
        images.forEach((img, i) => {
            const columnIndex = i % columnCount;
            columns[columnIndex].push(img);
        });
    }

    $: galleryStyle = `grid-template-columns: repeat(${columnCount}, 1fr); --gap: ${gap}px`;
</script>

<div id="gallery" bind:clientWidth={galleryWidth} style={galleryStyle}>
    {#each columns as column, columnIndex}
        <div class="photo-column">
            {#each column as imagePath}
                {#if isVideoPath(imagePath)}
                <button
                    on:click={(event) => handleClick(imagePath, event)}
                    on:mouseleave={(event) => handleMouseLeave(imagePath, event)}
                    class="photo-wrapper-button video-wrapper-button"
                    aria-label={unmutedVideo === imagePath ? 'mute video' : 'unmute video'}
                    class:active={clickedImages.has(imagePath)}
                    data-column-position={columnIndex === 0 ? "first" : columnIndex === columnCount - 1 ? "last" : "middle"}
                >
                <video
                    bind:this={videoEls[imagePath]}
                    src={imagePath}
                    class:img-hover={hover}
                    class:clicked={clickedImages.has(imagePath)}
                    class:right-shift={clickedImages.has(imagePath) && columnIndex === 0}
                    class:left-shift={clickedImages.has(imagePath) && columnIndex === columnCount - 1}
                    {loading}
                    muted
                    loop
                    autoplay
                ></video>
                <span class="mute-badge" aria-hidden="true">
                    {#if unmutedVideo === imagePath}
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path d="M3 10v4h4l5 4V6L7 10H3z" fill="white"/>
                            <path d="M16 8c1.5 1 2 2.5 2 4s-.5 3-2 4" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    {:else}
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path d="M3 10v4h4l5 4V6L7 10H3z" fill="white"/>
                            <path d="M16 8l5 8M21 8l-5 8" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    {/if}
                </span>
                </button>
                {:else}
                <button
                    on:click={(event) => handleClick(imagePath, event)}
                    on:mouseleave={(event) => handleMouseLeave(imagePath, event)}
                    class="photo-wrapper-button"
                    aria-label="enlarge image"
                    class:active={clickedImages.has(imagePath)}
                    data-column-position={columnIndex === 0 ? "first" : columnIndex === columnCount - 1 ? "last" : "middle"}
                >
                    <img
                        src={imagePath}
                        alt=""
                        class:img-hover={hover}
                        class:clicked={clickedImages.has(imagePath)}
                        class:right-shift={clickedImages.has(imagePath) && columnIndex === 0}
                        class:left-shift={clickedImages.has(imagePath) && columnIndex === columnCount - 1}
                        {loading}
                    />
                </button>
                {/if}
            {/each}
        </div>
    {/each}
</div>

<style>
    #gallery {
        width: calc(100% - 2 * var(--gap));
        display: grid;
        gap: var(--gap);
        margin: 0 var(--gap) 0;
    }
    #gallery .photo-column {
        display: flex;
        flex-direction: column;
    }
    #gallery .photo-column * {
        width: 100%;
        margin-top: var(--gap);
    }
    #gallery .photo-column *:nth-child(1) {
        margin-top: 0;
    }
    
    .photo-wrapper-button.active {
        z-index: 1000;
        transition: z-index 0s 0s; /* Apply z-index immediately when active */
    }
    
    /* Image hover effects */
    .img-hover {
        opacity: 0.9;
        transition: all 0.5s;
        will-change: transform, opacity; /* Hint browser for optimization */
    }
    
    .img-hover:hover {
        opacity: 1;
        transform: scale(1.05);
    }
    
    /* Clicked state animations - hardware accelerated */
    .clicked.img-hover:hover {
        transform: scale(2);
    }
    
    .clicked.right-shift.img-hover:hover {
        transform: scale(2) translateX(25%);
    }
    
    .clicked.left-shift.img-hover:hover {
        transform: scale(2) translateX(-25%);
    }

    .video-wrapper-button {
        position: relative;
    }

    #gallery .photo-column .mute-badge {
        position: absolute;
        bottom: 6px;
        right: 6px;
        width: 22px;
        height: 22px;
        margin: 0;
        display: grid;
        place-items: center;
        background: rgba(0, 0, 0, 0.55);
        border-radius: 999px;
        pointer-events: none;
        z-index: 2;
        transition: background 160ms ease;
    }

    .video-wrapper-button:hover .mute-badge {
        background: rgba(0, 0, 0, 0.8);
    }
</style>