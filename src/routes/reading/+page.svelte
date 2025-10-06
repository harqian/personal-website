<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import reading from "$lib/reading.json";
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <section class="section">
                <h2>reading</h2>
                <p>here are some online blogs/essays i have read</p>
                <hr class="horizontal-line">
            </section>
            <h2>authors</h2>
        {#each reading.authors as author}
            <a href={author.urls[0]}>{author.title}</a> <br>
        {/each}
        <h2>already read</h2>
        {#each reading.alr_read as reading}
            <a href={reading.urls[0]}>{reading.title}</a> <br>
            {#each reading.notes as note}
                <li>{note}</li>
            {/each}
        {/each}
        <h2>articles</h2>
        {#each reading.articles as reading}
            <a href={reading.urls[0]}>{reading.urls[0]}</a> <br>
            <li>{reading.title}</li>
        {/each}
        </div>
    </main>
</StarBackground>

