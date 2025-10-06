<script>
    import Gallery from "$lib/Gallery.svelte";
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";

    const numImages = 53;
    const imagePaths = [];

    for (let i = 1; i <= numImages; i++) {
        imagePaths.push(`gallery_images/${i}.webp`);
    }

    const numGifs = 3;
    const gifPaths = [];

    for (let i = 1; i <= numGifs; i++) {
        gifPaths.push(`gallery_gifs/${i}.webm`);
    }

    const mediaPaths = imagePaths.concat(gifPaths).sort(() => Math.random() - 0.5);
</script>

<StarBackground>
    <Header />
    <main>
        <h1>gallery</h1>
        <Gallery images={mediaPaths} gap={10} maxColumnWidth={250} hover={true} />
    </main>
</StarBackground>

<style>
    h1 {
        text-align: center;
    }
</style>

