<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    
    let hoveredInterest = null;
    let showContactInfo = false;
    
    function toggleContactInfo() {
        showContactInfo = !showContactInfo;
    }
</script>

<StarBackground>

    <Header />
    <div class="two-column-layout">
        <div class="left-column">
            <p>im a student that lives for learning</p>
            <p>i believe in intentional living, self-understanding, and growth</p>
            <p>to learn, i read, build, write, talk, and reflect</p>
        </div>
        <div class="right-column">
            <div class="image-container">
                <img src="/profile.png" alt="profile" />
            </div>
        </div>
    </div> 
    <div class="column">
        <p>check out <a href="/writing">my writing</a> for reflections and generalizations, <a href="/poetry">my poetry</a> for fun and artistic expression, <a href="/gallery">my media gallery</a> for cool scenery, <a href="/animal_media">my animal media</a> for cute (and not so cute) animals, 
            <!-- <a href="/cs_projects">my cs projects</a> to see what i have built (outdated), <a href="/other_projects">my other projects</a> for other things i built (also outdated T_T), and <a href="/app_reviews">my app reviews</a> for short app reviews! -->
        </p>
        <p>or, <button class="say-hi-btn" on:click={toggleContactInfo}>say hi</button>!</p>
        
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
            </div>
        {/if}
    </div>
    
</StarBackground>

<style>
    .two-column-layout {
        display: flex;
        width: 60%;
        margin: 0 auto;
        transition: width 0.3s ease-out;
        gap: 20px;
    }
    
    .left-column {
        flex: 1;
        min-width: 100px;
    }
    
    .right-column {
        flex: 1;
        justify-content: center;
        align-items: center;
        position: relative;
        display: flex;
    }
    
    .image-container {  
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        align-items: center;
    }
    
    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
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
        .two-column-layout {
            width: 90%;
        }
    }
</style>