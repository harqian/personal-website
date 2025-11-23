<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import Carousel from "$lib/Carousel.svelte";
    
    let hoveredInterest = null;
    let showContactInfo = false;

    // Auto-import carousel media using Vite's import.meta.glob
    // We import the files as URL strings suitable for <img>/<video> src
    const modules = import.meta.glob("$lib/assets/carousel_media/*", { eager: true, query: '?url', import: 'default' });
    const carouselItems = Object.values(modules);

    
    function toggleContactInfo() {
        showContactInfo = !showContactInfo;
    }
</script>

<StarBackground>
    <Header />
    <div class="carousel-container">
        <Carousel items={carouselItems} intervalMs={3000} autoplay={true} />
    </div>
    <div class="content">
        <p>hey there, im harrison 👋</p>
        <p>high school junior in the bay area</p>
        <p>enjoy cs, math, bio, physics, engineering, writing (generally learning is fun)</p>
        <p>other interests: chess, ultimate frisbee, singing, ukulele, tennis</p>
    </div>
    <div class="content">
        <p>
            to learn, 
            i read (<a href="/reading">reading</a>), build (<a href="/cs_projects">cs</a>, <a href="/other_projects">other</a>), 
            write/reflect (<a href="/writing">writing</a>, <a href="/poetry">poetry</a>, <a href="/notes">notes</a>), 
            and talk (yeah idk if i can put stuff here)
        </p>
        <p>I like knowledge, but also mindsets, perspectives, skills, self-mastery; all of these domains stack, resulting in exponentially better understanding of the world and myself.</p>
        <p>im usually very proactive and really care about personal growth, learning quickly, connection with others, and accountability</p>
        <p>check out <a href="/gallery">my media gallery</a> for cool scenery, <a href="/animal_media">my animal media</a> for cute (and not so cute) animals</p>

        <p>or, <button class="say-hi-btn" on:click={toggleContactInfo}>say hi</button>! i love talking to new people</p>
        
        {#if showContactInfo}
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fa fa-envelope"></i>
                    <span>dumbderivatives@gmail.com</span>
                </div>
                <div class="contact-item">
                    <i class="fa-brands fa-discord"></i>
                    <span>astronomicalflower</span>
                </div>
                <div class="contact-item">
                    <i class="fa fa-video"></i>
                    <span><a href="https://calendar.app.google/tkRTMQMjVEEoDWyR6">meeting link</a></span>
                </div>
            </div>
        {/if}
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
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: fadeIn 0.3s ease-in;
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    
    .contact-item:last-child {
        margin-bottom: 0;
    }
    
    .contact-item i {
        color: var(--link-color);
        width: 20px;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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
