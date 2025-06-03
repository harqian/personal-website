<script>
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    import appReviews from "$lib/appReviews.json"
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <section class="section">
            <h2>app reviews</h2>
            <p>this is a list of some apps that I use or have used, and my thhoughts on them </p>
            <hr class="horizontal-line">
        </section>
        {#each appReviews as appReview}
            {#if appReview.url.slice(0, 5) === "https"}
                <h3><a href="{appReview.url}" target="_blank">{appReview.text}</a> {appReview.outsideLink}</h3>
            {:else}
                <h3>{appReview.text} {appReview.outsideLink}</h3>
            {/if}
            <p>{appReview.review}</p>
        {/each}
    </div>
</main>
</StarBackground>
