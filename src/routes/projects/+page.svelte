<script>
    import { onMount } from "svelte";
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import allProjects from "$lib/projects.json";

    let copiedSlug = null;
    let highlightedSlug = null;

    async function copyLink(slug) {
        const url = `${location.origin}/projects#${slug}`;
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // fallback for browsers without clipboard API / non-secure contexts
            const ta = document.createElement("textarea");
            ta.value = url;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        copiedSlug = slug;
        setTimeout(() => {
            if (copiedSlug === slug) copiedSlug = null;
        }, 1500);
    }

    function highlightFromHash() {
        const slug = decodeURIComponent(location.hash.replace(/^#/, ""));
        if (!slug) return;
        const el = document.getElementById(slug);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightedSlug = slug;
        setTimeout(() => {
            if (highlightedSlug === slug) highlightedSlug = null;
        }, 2200);
    }

    onMount(() => {
        highlightFromHash();
        window.addEventListener("hashchange", highlightFromHash);
        return () => window.removeEventListener("hashchange", highlightFromHash);
    });

    // Collect all featured projects from all sections
    const featuredProjects = allProjects.sections
        .flatMap(section =>
            section.projects
                .filter(project => project.featured)
                .map(project => ({ ...project, category: section.title }))
        )
        .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

    function formatDateRange(startDate, endDate) {
        if (startDate === '?' || endDate === '?') {
            return '?';
        }
        const format = (dateString) => {
            const date = dateString.toLowerCase() === 'today' ? new Date() : new Date(dateString);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
        };
        return `${format(startDate)} → ${format(endDate)}`;
    }

    function getDefaultUrl(project) {
        return project.demo_url || project.github_url;
    }

    function getFeaturedMediaUrl(project) {
        return project.featured_media_url || project.demo_url || null;
    }

    function shouldShowDemoLink(project) {
        // always mirror the demo/featured link as a labeled button, even when the
        // title and media already point to it. otherwise people click it not knowing what it is.
        return Boolean(project.demo_url);
    }

    function getVisibleLinks(project) {
        // demo_url is already rendered as its own labeled button; don't duplicate it here.
        return (project.links || []).filter(link => link.url !== project.demo_url);
    }

    function getDemoLabel(project) {
        if (project.demo_url) {
            if (project.demo_url.includes('youtube.com') || project.demo_url.includes('youtu.be') || project.demo_url.includes('/view')) {
                return 'Watch Video';
            } else if (project.demo_url === '/') {
                return 'View Site';
            } else if (project.category.includes('Bot') || project.category.includes('Game')) {
                return 'Play Demo';
            } else {
                return 'Try It Out';
            }
        }
        return null;
    }

    function getDemoIcon(project) {
        if (project.demo_url) {
            if (project.demo_url.includes('youtube.com') || project.demo_url.includes('youtu.be')) {
                return 'fab fa-youtube';
            } else if (project.demo_url === '/') {
                return 'fas fa-external-link-alt';
            } else if (project.category.includes('Bot')) {
                return 'fas fa-gamepad';
            } else {
                return 'fas fa-external-link-alt';
            }
        }
        return null;
    }

    function isYouTubeUrl(url) {
        return Boolean(url && (url.includes('youtube.com') || url.includes('youtu.be')));
    }

    function isGoogleDriveUrl(url) {
        return Boolean(url && url.includes('drive.google.com/file/d/'));
    }

    function getYouTubeId(url) {
        if (!isYouTubeUrl(url)) return null;

        try {
            if (url.includes('youtu.be/')) {
                return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || null;
            }

            const parsed = new URL(url);
            return parsed.searchParams.get('v');
        } catch {
            return null;
        }
    }

    function getYouTubeEmbedUrl(project) {
        const videoId = getYouTubeId(getFeaturedMediaUrl(project));
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    }

    function getGoogleDriveEmbedUrl(project) {
        const mediaUrl = getFeaturedMediaUrl(project);
        if (!isGoogleDriveUrl(mediaUrl)) return null;

        const match = mediaUrl.match(/\/file\/d\/([^/]+)/);
        const fileId = match?.[1];
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
    }

    function getProjectMediaImage(project) {
        return project.preview_image || '/project_media/featured-placeholder.svg';
    }

    function slugify(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>projects</h2>
            <hr class="horizontal-line">

            <div class="projects-grid">
                {#each featuredProjects as project}
                    <div class="project-card" class:wide={project.media_wide}>
                        <div class="project-content">
                            <div class="category-badge">{project.category}</div>
                            <h3 id={slugify(project.title)} class:highlighted={highlightedSlug === slugify(project.title)}>
                                <span class="title-row">
                                    {#if getDefaultUrl(project)}
                                        <a href="{getDefaultUrl(project)}" target="_blank" rel="noopener">
                                            {project.title}
                                        </a>
                                    {:else}
                                        {project.title}
                                    {/if}
                                    <button
                                        type="button"
                                        class="copy-link"
                                        class:copied={copiedSlug === slugify(project.title)}
                                        title="Copy link to this project"
                                        aria-label="Copy link to this project"
                                        on:click={() => copyLink(slugify(project.title))}
                                    >
                                        <i class="fas {copiedSlug === slugify(project.title) ? 'fa-check' : 'fa-link'}"></i>
                                    </button>
                                </span>
                                <span class="date">{formatDateRange(project.start_date, project.end_date)}</span>
                            </h3>
                            <p>{project.description}</p>

                            <div class="project-links">
                                {#if project.github_url}
                                    <a href="{project.github_url}" target="_blank" rel="noopener" class="project-link github-link">
                                        <i class="fab fa-github"></i> GitHub
                                    </a>
                                {/if}
                                {#if shouldShowDemoLink(project)}
                                    <a href="{project.demo_url}" target="_blank" rel="noopener" class="project-link demo-link">
                                        <i class="{getDemoIcon(project)}"></i> {getDemoLabel(project)}
                                    </a>
                                {/if}
                                {#if getVisibleLinks(project).length > 0}
                                    {#each getVisibleLinks(project) as link}
                                        <a href="{link.url}" target="_blank" rel="noopener" class="project-link">
                                            {#if link.icon}
                                                <i class="{link.icon}"></i>
                                            {/if}
                                            {link.label}
                                        </a>
                                    {/each}
                                {/if}
                            </div>
                        </div>

                        <div class="project-media" class:natural={project.media_natural}>
                            {#if project.video_url}
                                <svelte:element
                                    this={getDefaultUrl(project) ? 'a' : 'div'}
                                    class="media-frame {getDefaultUrl(project) ? 'media-link' : ''}"
                                    href={getDefaultUrl(project) || undefined}
                                    target={getDefaultUrl(project) ? '_blank' : undefined}
                                    rel={getDefaultUrl(project) ? 'noopener' : undefined}
                                >
                                    <video
                                        src={project.video_url}
                                        poster={project.preview_image}
                                        autoplay
                                        muted
                                        loop
                                        playsinline
                                        style="pointer-events: none;"
                                    ></video>
                                </svelte:element>
                            {:else if project.iframe_url}
                                <div class="media-frame media-iframe">
                                    <iframe
                                        src={project.iframe_url}
                                        title={`${project.title} interactive embed`}
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            {:else if getYouTubeEmbedUrl(project)}
                                <div class="media-frame">
                                    <iframe
                                        src={getYouTubeEmbedUrl(project)}
                                        title={`${project.title} video preview`}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin"
                                        allowfullscreen
                                    ></iframe>
                                </div>
                            {:else if getGoogleDriveEmbedUrl(project)}
                                <div class="media-frame">
                                    <iframe
                                        src={getGoogleDriveEmbedUrl(project)}
                                        title={`${project.title} video preview`}
                                        loading="lazy"
                                        allow="autoplay"
                                    ></iframe>
                                </div>
                            {:else if getDefaultUrl(project)}
                                <a href="{getDefaultUrl(project)}" target="_blank" rel="noopener" class="media-frame media-link">
                                    <img src={getProjectMediaImage(project)} alt={`${project.title} preview`} />
                                </a>
                            {:else}
                                <div class="media-frame">
                                    <img src={getProjectMediaImage(project)} alt={`${project.title} preview`} />
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>

            <div class="view-all">
                <a href="/all-projects">view all projects →</a>
            </div>
        </div>
    </main>

    <style>
        .projects-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .project-card {
            background: var(--surface-2);
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
            gap: 1.5rem;
            align-items: stretch;
        }

        /* wide media: give the media column more room (pushing into the text)
           for landscape previews. text keeps a 300px floor so it can't squish
           too far. desktop-only — the mobile single-column rule still wins. */
        @media (min-width: 901px) {
            .project-card.wide {
                grid-template-columns: minmax(300px, 1fr) minmax(0, 1.35fr);
            }
        }

        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px var(--shadow);
        }

        .project-content {
            min-width: 0;
            position: relative;
            padding-bottom: 2.25rem;
        }

        .category-badge {
            display: inline-flex;
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: 0.75rem;
            color: var(--text-faint);
            background: var(--surface-2);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }

        .project-card h3 {
            margin: 0 0 0.75rem 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            scroll-margin-top: 90px;
            border-radius: 6px;
        }

        .title-row {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
        }

        .copy-link {
            border: none;
            background: transparent;
            color: var(--text-faint);
            cursor: pointer;
            padding: 0.15rem 0.35rem;
            border-radius: 4px;
            font-size: 0.8em;
            line-height: 1;
            opacity: 0;
            transition: opacity 0.2s, color 0.2s, background-color 0.2s;
        }

        .project-card:hover .copy-link {
            opacity: 1;
        }

        .copy-link:hover {
            color: var(--accent-blue);
            background: rgba(var(--accent-blue-rgb), 0.12);
        }

        .copy-link.copied {
            opacity: 1;
            color: var(--accent-green);
        }

        .project-card h3.highlighted {
            animation: flash-highlight 2.2s ease-out;
        }

        @keyframes flash-highlight {
            0%, 30% {
                background: rgba(var(--accent-yellow-rgb), 0.25);
                box-shadow: 0 0 0 6px rgba(var(--accent-yellow-rgb), 0.12);
            }
            100% {
                background: transparent;
                box-shadow: 0 0 0 6px rgba(var(--accent-yellow-rgb), 0);
            }
        }

        .date {
            font-size: 0.85rem;
            color: var(--text-faint);
            font-weight: normal;
            margin-left: 0.5rem;
            white-space: nowrap;
        }

        .project-card p {
            margin: 0.5rem 0 1rem 0;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .project-links {
            display: flex;
            gap: 0.75rem;
            margin-top: 0.75rem;
            flex-wrap: wrap;
        }

        .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.8rem;
            background: rgba(var(--accent-blue-rgb), 0.1);
            border-radius: 4px;
            font-size: 0.9rem;
            transition: background-color 0.2s, transform 0.2s;
            text-decoration: none;
            color: inherit;
        }

        .project-link:hover {
            background: rgba(var(--accent-blue-rgb), 0.2);
            text-decoration: none;
            transform: translateY(-1px);
        }

        .github-link {
            background: var(--surface-2);
        }

        .github-link:hover {
            background: var(--surface-3);
        }

        .demo-link {
            background: rgba(var(--accent-blue-rgb), 0.15);
        }

        .demo-link:hover {
            background: rgba(var(--accent-blue-rgb), 0.25);
        }

        .project-link i {
            font-size: 0.9em;
        }

        .project-media {
            min-width: 0;
        }

        .media-frame {
            width: 100%;
            height: 100%;
            min-height: 260px;
            border-radius: 10px;
            overflow: hidden;
            background: var(--surface-1);
            border: 1px solid var(--border);
            display: block;
        }

        .media-iframe {
            min-height: 360px;
        }

        .media-frame iframe,
        .media-frame video,
        .media-frame img {
            width: 100%;
            height: 100%;
            display: block;
            border: 0;
        }

        .media-frame img,
        .media-frame video {
            object-fit: cover;
        }

        .media-link {
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .media-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px var(--shadow);
        }

        /* freeform media: render the image at its natural aspect instead of
           cropping/letterboxing it into the fixed tall frame */
        .project-media.natural {
            align-self: center;
        }

        .project-media.natural .media-frame {
            height: auto;
            min-height: 0;
        }

        .project-media.natural .media-frame img {
            height: auto;
            object-fit: contain;
        }

        .horizontal-line {
            border: none;
            height: 1px;
            background-color: var(--border);
            margin: 1.5rem 0;
        }

        .view-all {
            text-align: center;
            margin: 3rem 0 2rem 0;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
        }

        .view-all a {
            font-size: 0.9rem;
            color: var(--text-faint);
            text-decoration: none;
            transition: color 0.2s;
        }

        .view-all a:hover {
            color: var(--text-muted);
        }

        @media (max-width: 900px) {
            .project-card {
                grid-template-columns: 1fr;
            }

            .media-frame {
                min-height: 220px;
            }
        }
    </style>
</StarBackground>
