<script>
    import { onMount } from 'svelte';
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    
    // Add your piece filenames here (without .md extension)
    const pieceFilenames = [
        "water_bottles",
        "a_glimpse_into_consciousness",
        "how_confidence_changed_my_life",
        "addiction"
    ];
    
    let writing = [];
    
    onMount(async () => {
        try {
            // Fetch and parse each piece's metadata
            const writingPromises = pieceFilenames.map(async (filename) => {
                const writingResponse = await fetch(`/writing/${filename}.md`);
                const content = await writingResponse.text();
                
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
                            
                            if (currentKey === 'title') {
                                metadata.title = value;
                            } else if (currentKey === 'published') {
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
                    
                    // Use title from metadata if available, otherwise derive from filename
                    const titleFromFilename = filename.replace(/\.md$/, '').replace(/_/g, ' ');
                    return {
                        filename,
                        title: metadata.title || titleFromFilename,
                        ...metadata
                    };
                }
                return null;
            });
            
            const allWriting = await Promise.all(writingPromises);
            writing = allWriting
                .filter(writing => writing && writing.published)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
                
        } catch (error) {
            console.error('Error loading writing:', error);
        }
    });
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <section class="section">
            <h2>writing</h2>
            <p>mainly essays but some other stuff also (look out for essay on reflection in the next month!)</p>
            <hr class="horizontal-line">
        </section>
        {#each writing as piece}
            <article>
                <div class="title-row">
                    <h3><a href="/writing/{piece.filename}">{piece.title}</a></h3>
                </div>
                <div class="meta-row">
                    {#if piece.tags && piece.tags.length > 0 && piece.tags[0] !== ""}
                        <div class="tags">
                            {#each piece.tags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    {/if}
                    <time class="date">
                        {new Date(piece.date).toLocaleDateString()}
                        {#if piece.edited}
                            <span class="edited">(edited {new Date(piece.edited).toLocaleDateString()})</span>
                        {/if}
                    </time>
                </div>
            </article>
        {/each}
    </div>
</main>
</StarBackground>

<style>
    article {
        margin-bottom: 2rem;
    }
    
    .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
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