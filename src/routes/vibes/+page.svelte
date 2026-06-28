<script>
    import Gallery from "$lib/Gallery.svelte";
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";

    const ASSETS = "https://assets.harrisonqian.com";
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
        "vibes_memes/lk.webp",
        "vibes_memes/skill_issue.jpg",
        "vibes_memes/vibe_was_off.jpg",
        "vibes_memes/trippin.jpg",
        "vibes_memes/vortex_gambit.png",
        "vibes_memes/make_it_myself.webp",
        "vibes_memes/CleanShot 2026-04-10 at 12.10.54.png",
        "vibes_memes/trolley.webp",
        "vibes_memes/strawberry.webp",
        "vibes_memes/play.webp",
        "vibes_memes/ml.webp",
        "vibes_memes/dog.webp",
        "vibes_memes/screwdriver.webp",
        "vibes_memes/rabbit.jpg",
        "vibes_memes/build.png",
        "vibes_memes/a company.jpg",
        "vibes_memes/72b_mnist.png",
        "vibes_memes/companies.png",
        "vibes_memes/it_was_dns.png",
        "vibes_memes/didntgraduate.png",
        "vibes_memes/its_so_good.png",
        "vibes_memes/tui_4am.png",
        "vibes_memes/dune.jpg",
        "vibes_memes/me.jpg",
        "vibes_memes/reductive.jpg",
        "vibes_memes/basketball.png",
        "vibes_memes/casts_spells.jpg",
        "vibes_memes/im_a_person.jpg",
        "vibes_memes/capitalism_and_families.png",
        "vibes_memes/pcb_design.png",
        "vibes_memes/company.jpg",
        "vibes_memes/goose.png",
        "vibes_memes/to_be_cringe_is_to_be_free.mp4",
        "vibes_memes/download.mp4",
        "vibes_memes/romantic_homicide.webm",
        "vibes_memes/city_of_stars_sad.mp4",
        "vibes_memes/mia_and_sebastians_theme_3am.mp4",
        "vibes_memes/thunderstruck_2cellos.mp4",
        "vibes_memes/automatica.mp4",
        "vibes_memes/marble_machine.mp4",
    ].map(p => `${ASSETS}/${p}`).sort(() => Math.random() - 0.5);
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
