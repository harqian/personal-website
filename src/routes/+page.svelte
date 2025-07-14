<script>
    import primaryInterestsInfo from "$lib/primaryInterestsInfo.json";
    import secondaryInterestsInfo from "$lib/secondaryInterestsInfo.json";
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    
    let hoveredInterest = null;

    function handlePrimaryHover(interest) {
        hoveredInterest = interest;
        primaryInterestsInfo[interest].index = (primaryInterestsInfo[interest].index + 1) % primaryInterestsInfo[interest].media.length
    }

    function handleSecondaryHover(interest) {
        hoveredInterest = interest;
        secondaryInterestsInfo[interest].index = (secondaryInterestsInfo[interest].index + 1) % secondaryInterestsInfo[interest].media.length
    }

    function handlePrimaryClick(interest) {
        primaryInterestsInfo[interest].index = (primaryInterestsInfo[interest].index + 1) % primaryInterestsInfo[interest].media.length
    }

    function handleSecondaryClick(interest) {
        secondaryInterestsInfo[interest].index = (secondaryInterestsInfo[interest].index + 1) % secondaryInterestsInfo[interest].media.length
    }
</script>

<StarBackground>
    <Header />
    <div class="column">
        <h2>about</h2>
        <hr class="horizontal-line" />
        <p>im a student that loves learning, exploring, and reflecting</p>
        <p>i think talking to new people is incredibly valuable; please hit me up at my email or discord if you want to chat about anything! i promise it will be a fun time.</p>
    </div>
    <div class="two-column-layout">
        <div class="left-column">
            <section class="section">
                <p>activities</p>
                <ul>
                    {#each Object.entries(primaryInterestsInfo) as [interest, info]}
                    <li 
                        class="hover-item"
                        on:mouseenter={() => handlePrimaryHover(interest)}
                    >
                        <button
                            class="text-wrapper-button"
                            on:click={() => handlePrimaryClick(interest)}
                        >
                            {interest}
                        </button>
                    </li>
                    {/each}
                </ul>
                <p>and also</p>
                <ul>
                    {#each Object.entries(secondaryInterestsInfo) as [interest, info]}
                    <li 
                        class="hover-item"
                        on:mouseenter={() => handleSecondaryHover(interest)}
                    >
                        <button
                            class="text-wrapper-button"
                            on:click={() => handleSecondaryClick(interest)}
                        >
                            {interest}
                        </button>
                    </li>
                    {/each}
                </ul>
            </section>
        </div>
        
        <div class="right-column">
            <div class="image-container">
                {#each Object.entries(primaryInterestsInfo).concat(Object.entries(secondaryInterestsInfo)) as [interest, info]}
                    <img 
                        src={info.media[info.index] || `/api/placeholder/400/300`} 
                        alt="{interest} media"
                        class="hover-image"
                        class:visible={hoveredInterest === interest}
                    />
                {/each}
            </div>
        </div>
    </div>
</StarBackground>

<style>
    .two-column-layout {
        display: flex;
        width: 60%;
        margin: 0 auto;
        transition: width 0.3s ease-out;
    }
    
    .left-column {
        flex: 0 0 auto;
        min-width: 100px;
    }
    
    .right-column {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .image-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .hover-image {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
        opacity: 0;
        position: absolute;
        transition: opacity 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    .hover-image.visible {
        opacity: 1;
    }
    
    .hover-item {
        cursor: pointer;
        transition: color 0.3s;
    }
    
    .text-wrapper-button {
        text-decoration: underline;
    }
    
    .hover-item:hover {
        color: var(--link-color);
    }
    
    ul {
        margin-top: 0px;
        padding-left: 25px;
    }
    
    p ~ ul {
        margin-top: -10px;
    }
    
    .section {
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .two-column-layout {
            width: 90%;
        }
    }
</style>