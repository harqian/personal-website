<script>
    import { onMount } from 'svelte';
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";

    const noteFilenames = [
        "rejection_&_connection",
        "sftw_events",
        "promotion_options",
        "great_things",
        "quotes",
        "reset_options",
    ];

    let notes = [];

    onMount(async () => {
        try {
            const notePromises = noteFilenames.map(async (filename) => {
                const noteResponse = await fetch(`/notes/${filename}.md`);
                const content = await noteResponse.text();

                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = frontmatterMatch[1];
                    const metadata = {};

                    const lines = frontmatter.split('\n');
                    let currentKey = '';

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) continue;

                        if (trimmedLine.includes(':')) {
                            const [key, ...valueParts] = trimmedLine.split(':');
                            currentKey = key.trim();
                            let value = valueParts.join(':').trim();
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
                        else if (trimmedLine.startsWith('-') && currentKey === 'tags') {
                            const tag = trimmedLine.substring(1).trim();
                            if (!metadata.tags) metadata.tags = [];
                            metadata.tags.push(tag);
                        }
                    }

                    const titleFromFilename = filename.replace(/\.md$/, '').replace(/_/g, ' ');
                    return {
                        filename,
                        title: metadata.title || titleFromFilename,
                        ...metadata
                    };
                }
                return null;
            });

            const allNotes = await Promise.all(notePromises);
            notes = allNotes
                .filter(note => note && note.published)
                .map(note => ({
                    ...note,
                    filteredTags: note.tags ? note.tags.filter(t => t && t.trim()) : []
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            console.error('Error loading notes:', error);
        }
    });
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <section class="section">
                <h2>notes</h2>
                <p>quick thoughts, observations, and references</p>
                <hr class="horizontal-line">
            </section>
        {#each notes as note}
            <article>
                <div class="title-row">
                    <h3><a href="/notes/{note.filename}">{note.title}</a></h3>
                </div>
                <div class="meta-row">
                    {#if note.filteredTags && note.filteredTags.length > 0}
                        <div class="tags">
                            {#each note.filteredTags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    {/if}
                    <time class="date">
                        {new Date(note.date).toLocaleDateString()}
                        {#if note.edited}
                            <span class="edited">(edited {new Date(note.edited).toLocaleDateString()})</span>
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
