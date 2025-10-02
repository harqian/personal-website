<script>
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    import generalizations from "$lib/generalizations.json"
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <section class="section">
            <h2>generalizations</h2>
            <p>here are some generalizations i have made through reflection & experimentation</p>
            <p>disclaimer: these are all from MY perspective (important!) so they may not be true or helpful for you</p>
            <hr class="horizontal-line">
        </section>
        {#each generalizations as generalization}
            <h3>{generalization.title}</h3>
            {#if generalization.description}
                <li>{generalization.description}</li>
            {/if}
        {/each}
    </div>
</main>
</StarBackground>