<script>
    import ThemeControls from "$lib/ThemeControls.svelte";
</script>

<ThemeControls />
<slot />

<svelte:head>
    <meta property="og:title" content="Harrison Qian's website" />
    <meta property="og:description" content={`“now i will have less distraction” —leonhart euler after losing an eye`} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Harrison Qian's website" />
    <meta name="twitter:description" content={`“now i will have less distraction” —leonhart euler after losing an eye`} />
    <!-- import two different versions of font awesome so all the icons work -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <!-- Space Mono from google fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
    />
    <!-- Geist Mono (default body font) + Source Serif 4 (elegant serif toggle) from google fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">
</svelte:head>

<style>
    /*
      theming model: every color is a semantic token defined once here.
      dark is the default (:root); light overrides only the tokens that change.
      colors are grouped by ROLE (text hierarchy, surfaces, borders, scrims,
      accents) so a few tokens flip instead of ~60 one-off hex values.
      two independent axes: data-theme (dark|light) and data-font (mono|serif).
    */
    :root {
        color-scheme: dark;

        /* fonts */
        --font-mono: "Geist Mono", monospace;
        --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
        --font-body: var(--font-mono); /* default; data-font="serif" overrides */

        /* page background */
        --bg: #000;
        --bg-gradient: linear-gradient(to bottom, #050E1F, #1A0B2E);
        --default-background: var(--bg-gradient); /* alias used by StarBackground */

        /* text hierarchy (primary -> faint) */
        --text: #fff;
        --text-secondary: #ccc;
        --text-muted: #a0a0a0; /* groups old #aaa / #bbb / #999 */
        --text-faint: #7c7c7c; /* groups old #888 / #666 */

        /* translucent surfaces that lift off the background */
        --surface-1: rgba(255, 255, 255, 0.04);
        --surface-2: rgba(255, 255, 255, 0.06);
        --surface-3: rgba(255, 255, 255, 0.09);
        --surface-solid: #1a1a1a; /* opaque panel (discord frame) */

        /* hairline borders */
        --border: rgba(255, 255, 255, 0.10);
        --border-strong: rgba(255, 255, 255, 0.18);
        --border-color: var(--border); /* alias used by .horizontal-line */

        /* drop shadows */
        --shadow: rgba(0, 0, 0, 0.25);
        --shadow-strong: rgba(0, 0, 0, 0.40);

        /* media scrims: dark pills/captions that sit OVER photos & video.
           identical in both themes (the media underneath is theme-independent) */
        --scrim: rgba(0, 0, 0, 0.45);
        --scrim-soft: rgba(0, 0, 0, 0.55);
        --scrim-strong: rgba(0, 0, 0, 0.70);
        --on-scrim: rgba(255, 255, 255, 0.95); /* text/icons on a scrim */

        /* accents */
        --link-color: #4da6ff;
        --accent-blue: #4dabf7;
        --accent-blue-rgb: 77, 171, 247;
        --accent-yellow: #ffd43b;
        --accent-yellow-rgb: 255, 212, 59;
        --accent-green: #51cf66;
        --blue-icon-shadow: rgb(33, 150, 243);
        --red-icon-shadow: rgb(244, 67, 54);

        /* starfield: white twinkles on the night sky */
        --star-rgb: 255, 255, 255;
        --cloud-color: #ffffff; /* only visible in day mode */
    }

    :global(html[data-font="serif"]) {
        --font-body: var(--font-serif);
    }

    :global(html[data-theme="light"]) {
        color-scheme: light;

        --bg: #eef2f8;
        /* daytime sky: soft blue up top fading pale, so white clouds read */
        --bg-gradient: linear-gradient(to bottom, #cfe0f5, #eef2f8);

        --text: #16181d;
        --text-secondary: #3c4049;
        --text-muted: #5f6470;
        --text-faint: #8a8e98;

        /* polarity flips: dark tints pressing into a light page */
        --surface-1: rgba(0, 0, 0, 0.03);
        --surface-2: rgba(0, 0, 0, 0.05);
        --surface-3: rgba(0, 0, 0, 0.07);
        --surface-solid: #ececec;

        --border: rgba(0, 0, 0, 0.12);
        --border-strong: rgba(0, 0, 0, 0.20);

        --shadow: rgba(15, 23, 42, 0.10);
        --shadow-strong: rgba(15, 23, 42, 0.16);

        /* scrims + on-scrim deliberately unchanged (they ride over media) */

        --link-color: #1668d6;
        --accent-blue: #1668d6;
        --accent-blue-rgb: 22, 104, 214;
        --accent-green: #2b8a3e;
        /* bright #ffd43b washes out on a light page, so the vibe accent
           (whoosh-link underline, highlight flash, landed pulse) deepens to gold */
        --accent-yellow: #c8860b;
        --accent-yellow-rgb: 200, 134, 11;

        /* in day the stars fade out and clouds drift in; this indigo only
           shows during the brief star fade-out */
        --star-rgb: 92, 105, 150;
    }

    /* Global styles */
    :global(body, html) {
        background-color: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 0;
        font-family: var(--font-body);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* smooth the flip between themes/fonts without animating during scroll */
    :global(body) {
        transition: background-color 0.4s ease, color 0.4s ease;
    }

    /* code stays monospace even when the body switches to serif */
    :global(code, pre, kbd, samp) {
        font-family: var(--font-mono);
    }

    :global(h1, h2, h3, h4) {
        text-wrap: balance;
    }

    :global(p) {
        text-wrap: pretty;
    }

    :global(a) {
        color: var(--link-color);
    }

    :global(h1) {
        text-align: left;
        font-size: 2rem;
        margin: 1.5rem 0;
    }

    :global(h2) {
        font-size: 1.5rem;
        margin: 1.3rem 0;
    }

    :global(h3) {
        font-size: 1.25rem;
        margin: 1.1rem 0;
    }

    :global(h4) {
        font-size: 1rem;
        margin: 1rem 0;
    }

    :global(li) {
        margin-left: 2rem;
        margin-bottom: 0.5rem;
        list-style-type: disc;
    }

    :global(.photo-wrapper-button) {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
        display: inline-block;
        line-height: 0;
        outline: none;
        position: relative;
        z-index: 1;
        transition: z-index 0s 0.5s; /* Delay z-index change until after animation */
    }

    :global(.text-wrapper-button) {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        width: 100%;
        text-align: left;
        font: inherit;
        color: inherit;
        cursor: pointer;
        display: inline-block;
        outline: none;
        position: relative;
        z-index: 1;
        transition: z-index 0s 0.5s; /* Delay z-index change until after animation */
    }

    :global(.column) {
        margin: auto;
        width: 60%;
        transition: width 0.3s ease-out;
    }

    @media (max-width: 768px) {
        :global(.column) {
            width: 90%;
        }
    }

    :global(.horizontal-line) {
        border: none;
        height: 1px;
        background-color: var(--border-color, #ddd);
        margin: 1rem 0 2rem 0;
        width: 100%;
    }
</style>
