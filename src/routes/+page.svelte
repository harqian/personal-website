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
    <div class="hero">
        <div class="hero-text">
            <p>hey there, im harrison</p>
            <p>-> bay area</p>
            <p>i love learning so i taught myself four years of math in one, then kept going — piano, programming, ultimate frsibee, neurotech.</p>
            <p>last summer i helped engineer vestibular stimulation at a neurotech startup — we got someone from fully awake to nearly asleep in three minutes. this year ive been shipping apps, winning hackathons, and training CNNs to read consciousness states from brain waves. i once spent 30 hours debugging a heater.</p>
            <p>some of what ive built is in <a href="/projects">here</a>.</p>
            <p>feel free to look around or <button class="say-hi-btn" on:click={toggleContactInfo}>say hi</button>! i respond to everyone :)</p>

            <div
                class="contact-info"
                class:open={showContactInfo}
                aria-hidden={!showContactInfo}
                bind:this={contactInfoEl}
            >
                <div class="contact-item" style="--i: 0">
                    <i class="fa fa-envelope"></i>
                    <span><a href="mailto:harrisonq125@gmail.com">harrisonq125@gmail.com</a></span>
                </div>
                <div class="contact-item" style="--i: 1">
                    <i class="fa-brands fa-discord"></i>
                    <span><a href="https://discord.com/users/1297739861649920053">harqian</a></span>
                </div>
                <div class="contact-item" style="--i: 2">
                    <i class="fa fa-video"></i>
                    <span><a href="https://calendar.app.google/RJPd9A49VgwTbQWdA">meeting link</a></span>
                </div>
            </div>
        </div>
        <div class="hero-carousel">
            <Carousel items={carouselItems} intervalMs={3000} autoplay={true} durations={durations} />
        </div>
    </div>

    <section class="friends-section">
        <h2 class="friends-heading">here are some of my friends on discord</h2>
        <p class="friends-tag">i like to be connected 😊</p>
        <div class="friends-frame">
            <iframe src="/discord-friends-graph-demo.html" title="my discord friends graph" loading="lazy"></iframe>
        </div>
        <p class="friends-caption">
            click a node, drag to pan, scroll to zoom
        </p>
    </section>

</StarBackground>

<style>
    .hero {
        width: 90%;
        max-width: 1100px;
        margin: 0 auto 2rem auto;
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
        gap: 2rem;
        align-items: start;
    }

    .hero-text {
        min-width: 0;
    }

    .hero-text p {
        margin-bottom: 0.6rem;
    }

    .hero-carousel {
        width: 100%;
        aspect-ratio: 1 / 1;
    }

    .hero-carousel :global(img),
    .hero-carousel :global(video) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        outline: 1px solid rgba(255, 255, 255, 0.08);
        outline-offset: -1px;
    }

    .friends-section {
        width: 90%;
        max-width: 1100px;
        margin: 3rem auto 4rem auto;
    }

    .friends-heading {
        font-size: 1.3rem;
        color: #fff;
        margin: 0 0 0.35rem 0;
        font-weight: 600;
    }

    .friends-tag {
        color: #b9bbbe;
        margin: 0 0 1rem 0;
    }

    .friends-frame {
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #1a1a1a;
        height: 500px;
    }

    .friends-frame iframe {
        width: 100%;
        height: 100%;
        display: block;
        border: 0;
    }

    .friends-caption {
        margin-top: 0.75rem;
        font-size: 0.85rem;
        color: #888;
        text-align: center;
    }

    .friends-caption a {
        color: #aaa;
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
        .hero {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        .hero-carousel {
            aspect-ratio: 4 / 3;
            order: -1;
        }
        .friends-frame {
            height: 380px;
        }
    }
</style>
