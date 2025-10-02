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
            <p>hey there, im harrison 👋</p>
            <p>high school junior in the bay area</p>
            <p>enjoy cs, math, bio, physics, engineering, writing (generally learning is fun)</p>
            <p>other interests: chess, ultimate frisbee, singing, ukulele, tennis</p>


        </div>
        <div class="right-column">
            <div class="image-container">
                <img src="/profile.png" alt="profile" />
            </div>
        </div>
    </div> 
    <div class="column">
        <p>
            to learn, 
            i read (<a href="/reading">reading</a>), build (<a href="/cs_projects">cs</a>, <a href="/other_projects">other</a>), 
            write/reflect (<a href="/writing">writing</a>, <a href="/poetry">poetry</a>), 
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