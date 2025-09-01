<script>
    import iconInfos from "$lib/iconInfos.json"
    import SocialIcons from "$lib/SocialIcons.svelte"
</script>

<header>
    <h1><a href="/">Moonflower</a></h1>
    <SocialIcons {iconInfos} size="fa-2x"></SocialIcons>
    <nav>
        <ul class="nav-links">
            <li><a href="/writing">writing</a></li>
            <li><a href="/poetry">poetry</a></li>
            <li><a href="/gallery">gallery</a></li>
            <li><a href="/animal_media">animal media</a></li>
            <li><a href="/generalizations">generalizations</a></li>
            <li><a href="/cs_projects">cs projects</a></li>
            <li><a href="/other_projects">other projects</a></li>
            <li><a href="/reading">reading</a></li>
            <!-- <li><a href="/app_reviews">app reviews</a></li>  -->
            <!-- <li><a href="resume.pdf" target="_blank" rel="noopener noreferrer">outdated resume</a></li> -->
        </ul>
    </nav>
    <hr class="horizontal-line" />
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    ul {
        padding: 0;
    }

    h1 {
        margin-bottom: 0.5rem;
    }

    .nav-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0 3rem 0;
        transition: gap 0.2s;
    }

    .nav-links a {
        transition: opacity 0.2s;
        font-size: 1.1rem;
    }

    .nav-links a:hover {
        opacity: 0.7;
    }

    @media (max-width: 768px) {
        .nav-links {
            gap: 0.5rem;
        }

        .nav-links a {
            font-size: 1rem;
        }
    }
</style>
