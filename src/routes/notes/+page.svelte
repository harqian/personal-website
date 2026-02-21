<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
    import websiteNotesData from '$lib/websiteNotes.json';

    const notes = (websiteNotesData?.notes || [])
        .map((note) => ({
            ...note,
            filteredTags: Array.isArray(note.tags) ? note.tags.filter((t) => t && t.trim()) : []
        }))
        .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
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
        {#if notes.length === 0}
            <p>no publishable notes yet</p>
        {:else}
            {#each notes as note}
                <article>
                    <div class="title-row">
                        <h3><a href="/notes/{note.slug}">{note.title}</a></h3>
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
        {/if}
        </div>
    </main>
</StarBackground>


<style>
    article {
        margin-bottom: 2rem;
    }

    .meta-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .meta-row .date {
        margin-left: auto;
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
