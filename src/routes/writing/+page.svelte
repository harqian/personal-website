<script>
    import { onMount } from 'svelte';
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    
    // Add your essay filenames here (without .md extension)
    const essayFilenames = [
        "water_bottles",
        "a_glimpse_into_consciousness",
        "how_confidence_changed_my_life"
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
                    
                        // Parse YAML-like frontmatter with hyphen-based tags
                    const lines = frontmatter.split('\n');
                    let currentKey = '';
                    
                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) continue;
                        
                        // Check if it's a key-value pair
                        if (trimmedLine.includes(':')) {
                            const [key, ...valueParts] = trimmedLine.split(':');
                            currentKey = key.trim();
                            let value = valueParts.join(':').trim();
                            
                            // Remove surrounding quotes if present
                            value = value.replace(/^["']|["']$/g, '');
                            
                            if (currentKey === 'published') {
                                metadata.published = value === 'true';
                            } else if (currentKey === 'tags') {
                                metadata.tags = [];
                            } else if (currentKey === 'date' || currentKey === 'edited') {
                                metadata[currentKey] = value;
                            }
                        } 
                        // Handle array items (tags with hyphens)
                        else if (trimmedLine.startsWith('-') && currentKey === 'tags') {
                            const tag = trimmedLine.substring(1).trim();
                            if (!metadata.tags) metadata.tags = [];
                            metadata.tags.push(tag);
                        }
                    }
                    
                    return {
                        filename,
                        title: filename.replace(/\.md$/, '').replace(/_/g, ' '),
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
            <h2>writing</h2>
            <p>mainly essays but some other stuff also</p>
            <hr class="horizontal-line">
        </section>
        {#each essays as essay}
            <article>
                <div class="title-row">
                    <h3><a href="/essays/{essay.filename}">{essay.title}</a></h3>
                    <time class="date">
                        {new Date(essay.date).toLocaleDateString()}
                        {#if essay.edited}
                            <span class="edited">(edited {new Date(essay.edited).toLocaleDateString()})</span>
                        {/if}
                    </time>
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
    article {
        margin-bottom: 2rem;
    }
    
    .title-row {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;
    }
    
    .title-row h3 {
        margin: 0;
        flex: 1;
    }
    
    .title-row h3 a {
        color: inherit;
        text-decoration: none;
        transition: all 0.5s ease;
    }
    
    .title-row h3 a:hover {
        color: var(--link-color, #0066cc);
        text-decoration: underline;
    }
</style>