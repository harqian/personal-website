<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import allProjects from "$lib/projects.json";

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
        return Boolean(project.demo_url && project.demo_url !== getFeaturedMediaUrl(project));
    }

    function getVisibleLinks(project) {
        return (project.links || []).filter(link => link.url !== getFeaturedMediaUrl(project));
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
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>featured projects</h2>
            <p>a curated selection of my best work across code, video, and music</p>
            <hr class="horizontal-line">

            <div class="projects-grid">
                {#each featuredProjects as project}
                    <div class="project-card">
                        <div class="project-content">
                            <div class="category-badge">{project.category}</div>
                            <h3>
                                {#if getDefaultUrl(project)}
                                    <a href="{getDefaultUrl(project)}" target="_blank" rel="noopener">
                                        {project.title}
                                    </a>
                                {:else}
                                    {project.title}
                                {/if}
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

                        <div class="project-media">
                            {#if getYouTubeEmbedUrl(project)}
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
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
            gap: 1.5rem;
            align-items: stretch;
        }

        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
            color: #888;
            background: rgba(255, 255, 255, 0.05);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }

        .project-card h3 {
            margin: 0 0 0.75rem 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }

        .date {
            font-size: 0.85rem;
            color: #888;
            font-weight: normal;
            margin-left: 0.5rem;
            white-space: nowrap;
        }

        .project-card p {
            margin: 0.5rem 0 1rem 0;
            color: #ccc;
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
            background: rgba(77, 171, 247, 0.1);
            border-radius: 4px;
            font-size: 0.9rem;
            transition: background-color 0.2s, transform 0.2s;
            text-decoration: none;
            color: inherit;
        }

        .project-link:hover {
            background: rgba(77, 171, 247, 0.2);
            text-decoration: none;
            transform: translateY(-1px);
        }

        .github-link {
            background: rgba(100, 100, 100, 0.15);
        }

        .github-link:hover {
            background: rgba(120, 120, 120, 0.25);
        }

        .demo-link {
            background: rgba(77, 171, 247, 0.15);
        }

        .demo-link:hover {
            background: rgba(77, 171, 247, 0.25);
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
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: block;
        }

        .media-frame iframe,
        .media-frame img {
            width: 100%;
            height: 100%;
            display: block;
            border: 0;
        }

        .media-frame img {
            object-fit: cover;
        }

        .media-link {
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .media-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
        }

        .horizontal-line {
            border: none;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.1);
            margin: 1.5rem 0;
        }

        .view-all {
            text-align: center;
            margin: 3rem 0 2rem 0;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .view-all a {
            font-size: 0.9rem;
            color: #888;
            text-decoration: none;
            transition: color 0.2s;
        }

        .view-all a:hover {
            color: #aaa;
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
