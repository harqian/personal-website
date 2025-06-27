<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { marked } from 'marked';
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"
    
    let piece = null;
    let content = '';
    let loading = true;
    
    onMount(async () => {
        try {
            const slug = $page.params.slug;
            const response = await fetch(`/writing/${slug}.md`);
            
            if (!response.ok) {
                throw new Error('Piece not found');
            }
            
            const rawContent = await response.text();
            
            // Configure marked with proper options for links and emphasis
            marked.setOptions({
                gfm: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false
            });
            
            // Add custom footnote extension
            marked.use({
                extensions: [{
                    name: 'footnote',
                    level: 'inline',
                    start(src) { return src.match(/^\[\^/)?.index; },
                    tokenizer(src, tokens) {
                        const rule = /^\[\^([^\]]+)\]/;
                        const match = rule.exec(src);
                        if (match) {
                            return {
                                type: 'footnote',
                                raw: match[0],
                                text: match[1]
                            };
                        }
                    },
                    renderer(token) {
                        return `<sup><a href="#fn-${token.text}" id="fnref-${token.text}" class="footnote-ref">${token.text}</a></sup>`;
                    }
                }]
            });
            
            // Parse frontmatter
            const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            
            if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const markdownContent = frontmatterMatch[2];
                
                const metadata = {};
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
                const titleFromSlug = slug.replace(/\.md$/, '').replace(/_/g, ' ');
                piece = { ...metadata, title: metadata.title || titleFromSlug };
                
                // Process footnote definitions and convert to HTML
                let processedContent = markdownContent.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (match, id, text) => {
                    return `<div class="footnote-def" id="fn-${id}">
                        <a href="#fnref-${id}" class="footnote-number">${id}</a>
                        <span class="footnote-text">${marked.parseInline(text)}</span>
                    </div>`;
                });
                
                // Parse the markdown content
                content = marked.parse(processedContent);
            }
        } catch (error) {
            console.error('Error loading piece:', error);
        } finally {
            loading = false;
        }
    });

    function goBack() {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    }
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <a href="/writing"><h2>back</h2></a>
        <hr class="horizontal-line">
        
        {#if loading}
            <p>Loading...</p>
        {:else if piece}
            <article>
                <header>
                    <h2 class="title">{piece.title}</h2>
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
                </header>
                <div class="content">
                    {@html content}
                </div>
            </article>
        {:else}
            <p>Piece not found</p>
        {/if}
    </div>
</main>
</StarBackground>

<style>    
    header {
        margin-bottom: 2rem;
    }
    
    .title {
        margin-bottom: 0.5rem;
    }
    
    .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        color: #666;
        font-size: 0.9rem;
    }
    
    .content {
        line-height: 1.6;
        margin-bottom: 3rem;
    }

    .content :global(p) {
        margin-bottom: 1rem;
    }
    
    .content :global(blockquote) {
        border-left: 3px solid #ccc;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
    }
    
    /* Link styles */
    .content :global(a) {
        color: var(--link-color, #0066cc);
        text-decoration: underline;
        transition: all 0.2s ease;
    }
    
    .content :global(a:hover) {
        opacity: 0.8;
    }
    
    /* Emphasis styles */
    .content :global(em) {
        font-style: italic;
    }
    
    .content :global(strong) {
        font-weight: bold;
    }
    
    /* Footnote reference styles (in main text) */
    .content :global(.footnote-ref) {
        text-decoration: none;
        font-size: 0.8em;
        color: var(--link-color, #0066cc);
        transition: all 0.2s ease;
    }
    
    .content :global(.footnote-ref:hover) {
        text-decoration: underline;
    }
    
    /* Footnote definition styles */
    .content :global(.footnote-def) {
        display: flex;
        align-items: flex-start;
        margin-top: 1rem;
        padding-top: 0.5rem;
        font-size: 0.9em;
        line-height: 1.4;
    }
    
    .content :global(.footnote-def:first-of-type) {
        border-top: 2px solid #ccc;
        margin-top: 3rem;
        padding-top: 1rem;
    }
    
    .content :global(.footnote-number) {
        display: inline-block;
        min-width: 1.5rem;
        text-align: center;
        color: var(--link-color, #0066cc);
        text-decoration: none;
        cursor: pointer;
    }
    
    .content :global(.footnote-number:hover) {
        text-decoration: underline;
    }
    
    .content :global(.footnote-text a) {
        color: var(--link-color, #0066cc);
    }
</style>