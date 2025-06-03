<script>
    import { onMount } from 'svelte';
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    
    // Add your essay filenames here (without .md extension)
    const essayFilenames = [
        "water_bottles",
        "a_glimpse_into_consciousness"
    ];
    
    let essays = [];
    
    onMount(async () => {
        try {
            // Fetch and parse each essay's metadata
            const essayPromises = essayFilenames.map(async (filename) => {
                const essayResponse = await fetch(`/essays/${filename}.md`);
                const content = await essayResponse.text();
                
                // Parse frontmatter
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = frontmatterMatch[1];
                    const metadata = {};
                    
                    // Parse YAML-like frontmatter
                    frontmatter.split('\n').forEach(line => {
                        const [key, ...valueParts] = line.split(':');
                        if (key && valueParts.length) {
                            let value = valueParts.join(':').trim();
                            // Remove quotes
                            value = value.replace(/^["']|["']$/g, '');
                            // Parse arrays
                            if (value.startsWith('[') && value.endsWith(']')) {
                                value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
                            }
                            // Parse booleans
                            if (value === 'true') value = true;
                            if (value === 'false') value = false;
                            
                            metadata[key.trim()] = value;
                        }
                    });
                    
                    return {
                        filename,
                        ...metadata
                    };
                }
                return null;
            });
            
            const allEssays = await Promise.all(essayPromises);
            essays = allEssays
                .filter(essay => essay && essay.published)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
                
        } catch (error) {
            console.error('Error loading essays:', error);
        }
    });
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <section class="section">
            <h2>essays</h2>
        </section>
        {#each essays as essay}
            <article>
                <div class="title-row">
                    <h3><a href="/essays/{essay.filename}">{essay.title}</a></h3>
                    <time class="date">{new Date(essay.date).toLocaleDateString()}</time>
                </div>
                {#if essay.tags && essay.tags.length > 0 && essay.tags[0] !== ""}
                    <div class="tags">
                        {#each essay.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                {/if}
            </article>
        {/each}
    </div>
</main>
</StarBackground>

<style>
    .column {
        justify-content: space-between;
        margin: auto;
        width: 60%;
    }
    
    article {
        margin-bottom: 2rem;
    }
    
    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;
    }
    
    .title-row h3 {
        margin: 0;
        flex: 1;
    }
    
    .date {
        opacity: 0.7;
        font-size: 0.9rem;
        margin-left: 1rem;
        white-space: nowrap;
    }
    
    .tags {
        opacity: 0.7;
        font-size: 0.9rem;
    }
    
    .tag {
        margin-right: 0.5rem;
    }
</style>