<script>
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    import projects from "$lib/csProjects.json"
    
    // Sort projects within each section by end_date in descending order
    const sortedProjects = {
        sections: projects.sections.map(section => ({
            ...section,
            projects: [...section.projects]
                .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
                .map(project => ({
                    ...project,
                    sub_projects: project.sub_projects 
                        ? [...project.sub_projects].sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
                        : undefined
                }))
        }))
    };

    // Format date range as 'MMM yyyy → MMM yyyy' (e.g., 'Jan 2023 → Feb 2023')
    function formatDateRange(startDate, endDate) {
        const format = (dateString) => {
            // Handle 'today' as a special value
            const date = dateString.toLowerCase() === 'today' ? new Date() : new Date(dateString);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
        };
        return `${format(startDate)} → ${format(endDate)}`;
    }
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>cs projects</h2>
            <p>this is a list of some cs projects i have built (outdated but its ok)</p>
            <hr class="horizontal-line">
            {#each sortedProjects.sections as section}
                <section class="section">
                    <h2>{section.title}</h2>
                    {#if section.description}
                        <p>{section.description}</p>
                    {/if}
                    <hr class="horizontal-line">
                    
                    <div class="projects-grid">
                        {#each section.projects as project}
                            <div class="project-card">
                                <h3>
                                    {#if project.url}
                                        <a href="{project.url}" target="_blank" rel="noopener">
                                            {project.title}
                                        </a>
                                    {:else}
                                        {project.title}
                                    {/if}
                                    <span class="date">{formatDateRange(project.start_date, project.end_date)}</span>
                                </h3>
                                <p>{project.description}</p>
                                
                                <div class="project-links">
                                    {#if project.demo_url}
                                        <a href="{project.demo_url}" target="_blank" rel="noopener" class="project-link">
                                            View Demo
                                        </a>
                                    {/if}
                                    {#if project.links && project.links.length > 0}
                                        {#each project.links as link}
                                            <a href="{link.url}" target="_blank" rel="noopener" class="project-link">
                                                {#if link.icon}
                                                    <i class="{link.icon}"></i>
                                                {/if}
                                                {link.label}
                                            </a>
                                        {/each}
                                    {/if}
                                </div>

                                {#if project.sub_projects}
                                    <div class="sub-projects">
                                        {#each project.sub_projects as subProject}
                                            <div class="sub-project">
                                                <h4>
                                                    {#if subProject.url}
                                                        <a href="{subProject.url}" target="_blank" rel="noopener">
                                                            {subProject.title}
                                                        </a>
                                                    {:else}
                                                        {subProject.title}
                                                    {/if}
                                                    <span class="date">{formatDateRange(subProject.start_date, subProject.end_date)}</span>
                                                </h4>
                                                <p>{subProject.description}</p>
                                                
                                                <div class="project-links">
                                                    {#if subProject.url}
                                                        <a href="{subProject.url}" target="_blank" rel="noopener" class="project-link">
                                                            <i class="fab fa-github"></i> GitHub
                                                        </a>
                                                    {/if}
                                                    {#if subProject.links && subProject.links.length > 0}
                                                        {#each subProject.links as link}
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
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </section>
            {/each}
        </div>
    </main>

    <style>
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .project-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .project-card h3, .project-card h4 {
            margin: 0 0 0.75rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
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

        .project-link i {
            font-size: 0.9em;
        }

        .sub-projects {
            margin-top: 1rem;
            padding-left: 1rem;
            border-left: 2px solid rgba(255, 255, 255, 0.1);
        }

        .sub-project {
            margin: 1rem 0;
        }

        .section {
            margin-bottom: 3rem;
        }

        .section h2 {
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }

        .section p {
            color: #aaa;
            margin-bottom: 1.5rem;
        }

        .horizontal-line {
            border: none;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.1);
            margin: 1.5rem 0;
        }
    </style>
</StarBackground>
