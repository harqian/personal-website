<script>
    import { onMount } from "svelte";
    import { theme } from "$lib/theme.js";

    // two independent prefs, both persisted to localStorage and reflected as
    // attributes on <html>. defaults (dark + mono) are what the CSS :root assumes,
    // and app.html applies any saved override before first paint (no flash).
    // theme lives in a shared store so StarBackground can swap stars for clouds.
    let font = "mono"; // "mono" | "serif"
    let mounted = false;

    onMount(() => {
        const root = document.documentElement;
        theme.set(root.getAttribute("data-theme") === "light" ? "light" : "dark");
        font = root.getAttribute("data-font") === "serif" ? "serif" : "mono";
        mounted = true;
    });

    function toggleTheme() {
        const next = $theme === "light" ? "dark" : "light";
        theme.set(next);
        const root = document.documentElement;
        if (next === "light") root.setAttribute("data-theme", "light");
        else root.removeAttribute("data-theme");
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
    }

    function toggleFont() {
        font = font === "serif" ? "mono" : "serif";
        const root = document.documentElement;
        if (font === "serif") root.setAttribute("data-font", "serif");
        else root.removeAttribute("data-font");
        try {
            localStorage.setItem("font", font);
        } catch (e) {}
    }

    // open eye = light ("less distraction" the other way: open your eye, see the light);
    // closing / losing the eye = dark, nodding to the Euler quote on the home page.
    $: eyeOpen = $theme === "light";
</script>

<div class="controls" class:ready={mounted}>
    <!-- font toggle: the glyph renders in the active font, so it previews itself -->
    <button
        class="ctl font-toggle"
        on:click={toggleFont}
        aria-pressed={font === "serif"}
        aria-label={font === "serif" ? "switch to monospace font" : "switch to serif font"}
        title={font === "serif" ? "serif (click for mono)" : "mono (click for serif)"}
    >
        <span class="aa">Aa</span>
    </button>

    <!-- the Euler eye: open = light, closed = dark -->
    <button
        class="ctl eye-toggle"
        on:click={toggleTheme}
        aria-pressed={eyeOpen}
        aria-label={eyeOpen ? "close the eye (dark mode)" : "open the eye (light mode)"}
        title={eyeOpen ? "light — click to lose the eye" : "dark — click to open the eye"}
    >
        <svg class="eye" class:open={eyeOpen} viewBox="0 0 36 24" aria-hidden="true">
            <!-- open eye: almond outline + iris ring + pupil -->
            <g class="eyeball">
                <path
                    d="M3 12 Q18 2 33 12 Q18 22 3 12 Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                />
                <circle cx="18" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.6" />
                <circle cx="18" cy="12" r="2.4" fill="currentColor" />
            </g>
            <!-- closed eye: a downward lid arc with lashes -->
            <g class="lid">
                <path
                    d="M3 11 Q18 20 33 11"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />
                <line x1="10" y1="16.5" x2="8" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <line x1="18" y1="18.5" x2="18" y2="22.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <line x1="26" y1="16.5" x2="28" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </g>
        </svg>
    </button>
</div>

<style>
    .controls {
        position: fixed;
        top: 14px;
        right: 16px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 3px 5px;
        border-radius: 999px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        /* avoid a hydration flash: hidden until the component knows the real state */
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .controls.ready {
        opacity: 1;
    }

    .ctl {
        display: grid;
        place-items: center;
        width: 34px;
        height: 30px;
        padding: 0;
        border: none;
        background: none;
        color: var(--text);
        cursor: pointer;
        border-radius: 999px;
        opacity: 0.7;
        transition: opacity 0.18s ease, transform 0.18s ease;
    }
    .ctl:hover {
        opacity: 1;
        transform: scale(1.08);
    }
    .ctl:focus-visible {
        outline: 2px solid var(--link-color);
        outline-offset: 2px;
        opacity: 1;
    }

    .aa {
        font-family: var(--font-body);
        font-size: 1.05rem;
        line-height: 1;
        letter-spacing: -0.01em;
    }

    .eye {
        width: 26px;
        height: 18px;
        overflow: visible;
    }

    /* crossfade + a quick vertical squash sells the blink */
    .eye .eyeball,
    .eye .lid {
        transition: opacity 0.25s ease, transform 0.25s ease;
        transform-box: fill-box;
        transform-origin: center;
    }

    /* default state is dark -> eye closed */
    .eye .eyeball {
        opacity: 0;
        transform: scaleY(0.12);
    }
    .eye .lid {
        opacity: 1;
    }

    /* light -> eye open */
    .eye.open .eyeball {
        opacity: 1;
        transform: scaleY(1);
    }
    .eye.open .lid {
        opacity: 0;
        transform: scaleY(0.4);
    }

    @media (max-width: 768px) {
        .controls {
            top: 10px;
            right: 10px;
        }
    }
</style>
