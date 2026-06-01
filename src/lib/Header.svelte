<script>
    import iconInfos from "$lib/iconInfos.json"
    import SocialIcons from "$lib/SocialIcons.svelte"
    import { page } from "$app/stores"

    const navLinks = [
        { href: "/writing", label: "writing" },
        { href: "/poetry", label: "poetry" },
        { href: "/notes", label: "notes" },
        { href: "/vibes", label: "vibes" },
        { href: "/projects", label: "projects" },
        { href: "/other", label: "other" },
    ]

    // active on the section page itself or any nested route under it; home matches only exactly
    $: pathname = $page.url.pathname
    const isActive = (href, path) =>
        href === "/" ? path === "/" : path === href || path.startsWith(href + "/")
</script>

<header>
    <h1><a href="/" class:active={pathname === "/"}>Harrison Qian</a></h1>
    <SocialIcons {iconInfos} size="fa-2x"></SocialIcons>
    <nav>
        <ul class="nav-links">
            {#each navLinks as { href, label }}
                <a {href} class:active={isActive(href, pathname)}>{label}</a>
            {/each}
            <!-- <a href="/app_reviews">app reviews</a>  -->
            <!-- <a href="resume.pdf" target="_blank" rel="noopener noreferrer">outdated resume</a> -->
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
        font-size: 1.1rem;
        font-weight: normal;
        margin: 1.5rem 0 0.5rem;
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

    a.active {
        font-weight: 700;
    }

    @media (max-width: 768px) {
        .nav-links {
            gap: 0.5rem;
        }

        h1,
        .nav-links a {
            font-size: 1rem;
        }
    }
</style>
