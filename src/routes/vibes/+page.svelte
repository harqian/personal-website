<script>
    import Gallery from "$lib/Gallery.svelte";
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";

    const images = [
        "vibes_memes/VIBESMEME1.webp",
        "vibes_memes/VIBESMEME2.jpg",
        "vibes_memes/VIBESMEME3.jpg",
        "vibes_memes/VIBES_1.jpg",
        "vibes_memes/VIBES_2.jpg",
        "vibes_memes/fail_VIBES_MEME.jpg",
        "vibes_memes/russian_literature.jpg",
        "vibes_memes/model.jpeg",
        "vibes_memes/i dont car.jpg",
        "vibes_memes/autism.webp",
        "vibes_memes/vibes_guy.webp",
        "vibes_memes/social_media.webp",
        "vibes_memes/stop.jpeg",
        "vibes_memes/big_loud_nerd_af.png",
        "vibes_memes/optimize_stuck.jpg",
        "vibes_memes/funciton_typing.png",
        "vibes_memes/insane.jpg",
        "vibes_memes/automation.png",
        "vibes_memes/math.png",
    ].sort(() => Math.random() - 0.5);
</script>

<StarBackground>
    <Header />
    <main>
        <h1>vibes</h1>
        <Gallery images={images} gap={10} maxColumnWidth={300} hover={true} />
    </main>
</StarBackground>

<style>
    h1 {
        text-align: center;
    }
</style>
