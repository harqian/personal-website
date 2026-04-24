<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import Carousel from "$lib/Carousel.svelte";
    import durations from "$lib/assets/carouselDurations.json";
    import { tick } from "svelte";

    let hoveredInterest = null;
    let showContactInfo = false;
    let contactInfoEl;

    // auto-import carousel media using Vite's import.meta.glob
    // keep both the original filename and the built asset url
    const modules = import.meta.glob("$lib/assets/carousel_media/*", { eager: true, query: '?url', import: 'default' });

    // sort by filename before creating the carousel items array
    const carouselItems = Object.entries(modules)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([path, src]) => ({
            name: path.split('/').pop(),
            src
        }));

    
    async function toggleContactInfo() {
        const isOpening = !showContactInfo;
        showContactInfo = !showContactInfo;

        if (isOpening) {
            await tick();
            // wait for the expansion transition before scrolling, so
            // block:'end' targets the fully-expanded bottom instead of the
            // collapsed zero-height box (which sits right under "say hi")
            const el = contactInfoEl;
            const onEnd = (e) => {
                if (e.propertyName !== "max-height") return;
                el.removeEventListener("transitionend", onEnd);
                el.scrollIntoView({ behavior: "smooth", block: "end" });
            };
            el?.addEventListener("transitionend", onEnd);
        }
    }
</script>

<StarBackground>
    <Header />
    <div class="carousel-container">
        <Carousel items={carouselItems} intervalMs={3000} autoplay={true} durations={durations} />
    </div>
    <div class="content">
        <p>hey there, im harrison</p>
        <p>-> bay area</p>
        <p>i treat everything as learnable and most things as worth learning. taught myself four years of math in one, then kept going — piano, programming, ultimate frsibee, neurotech, whatever caught me next.</p>
        <p>last summer i helped engineer vestibular stimulation at a neurotech startup — we got someone from fully awake to nearly asleep in three minutes. this year ive been shipping apps, winning hackathons, and training CNNs to read consciousness states from brain waves. i once spent 30 hours debugging a heater.</p>
        <p>i love precise patterns — reducing a messy system down to the math that actually drives it, whether that's a topology proof, eddy currents explanation, or a circuit on a PCB.</p>
        <p>some of what ive built is in <a href="/projects">here</a>.</p>
        <p>some of what i'm looking to build in the future is in <a href="https://etherpad.mit.edu/p/harrison-ideas" target="_blank">here</a>.</p>
   </div>
    <div class="content">
        <p>feel free to look around or <button class="say-hi-btn" on:click={toggleContactInfo}>say hi</button>!</p>
        
        <div
            class="contact-info"
            class:open={showContactInfo}
            aria-hidden={!showContactInfo}
            bind:this={contactInfoEl}
        >
            <div class="contact-item" style="--i: 0">
                <i class="fa fa-envelope"></i>
                <span>harrisonq125@gmail.com</span>
            </div>
            <div class="contact-item" style="--i: 1">
                <i class="fa-brands fa-discord"></i>
                <span>harqian</span>
            </div>
            <div class="contact-item" style="--i: 2">
                <i class="fa fa-video"></i>
                <span><a href="https://calendar.app.google/tkRTMQMjVEEoDWyR6">meeting link</a></span>
            </div>
        </div>
    </div>
    
</StarBackground>

<style>
    .carousel-container {
        width: 60%;
        max-width: 520px;
        margin: 0 auto 2rem auto;
        aspect-ratio: 1 / 1;
    }

    .carousel-container :global(img),
    .carousel-container :global(video) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        outline: 1px solid rgba(255, 255, 255, 0.08);
        outline-offset: -1px;
    }

    .content {
        width: 60%;
        margin: 0 auto;
        transition: width 0.3s ease-out;
    }
    
    .say-hi-btn {
        background: none;
        border: none;
        color: var(--link-color);
        text-decoration: underline;
        cursor: pointer;
        font-size: inherit;
        font-family: inherit;
        padding: 0;
        margin: 0;
        transition: opacity 0.3s;
    }
    
    .say-hi-btn:hover {
        opacity: 0.7;
    }
    
    .contact-info {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.4);
        overflow: hidden;

        max-height: 0;
        margin-top: 0;
        padding-top: 0;
        padding-bottom: 0;
        opacity: 0;
        transition:
            max-height 0.35s ease,
            margin-top 0.35s ease,
            padding-top 0.35s ease,
            padding-bottom 0.35s ease,
            opacity 0.25s ease;
    }

    .contact-info.open {
        max-height: 400px;
        margin-top: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        opacity: 1;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;

        opacity: 0;
        transform: translateY(8px);
        filter: blur(4px);
        transition:
            opacity 0.3s ease,
            transform 0.3s ease,
            filter 0.3s ease;
        transition-delay: 0s;
    }

    .contact-info.open .contact-item {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
        transition-delay: calc(120ms + var(--i) * 80ms);
    }

    .contact-item:last-child {
        margin-bottom: 0;
    }

    .contact-item i {
        color: var(--link-color);
        width: 20px;
        /* optical nudge: icon glyphs often sit slightly above the text baseline */
        transform: translateY(1px);
    }
        
    @media (max-width: 768px) {
        .carousel-container {
            width: 90%;
            aspect-ratio: 4 / 3;
        }
        .content {
            width: 90%;
        }
    }
</style>
