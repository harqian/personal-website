<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import { page } from "$app/stores";
</script>

<StarBackground>
    <Header />
    <div class="content">
        <h1>{$page.status}: page not found</h1>
        <p>this page doesnt exist (or hasnt been built yet).</p>
        <p><a href="/">go home</a></p>
    </div>
</StarBackground>

<style>
    .content {
        width: 60%;
        margin: 4rem auto 0 auto;
        text-align: center;
    }

    .content h1 {
        text-align: center;
    }

    @media (max-width: 768px) {
        .content {
            width: 90%;
        }
    }
</style>
