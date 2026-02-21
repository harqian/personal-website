<script>
    import { page } from '$app/stores';
    import { marked } from 'marked';
    import websiteNotesData from '$lib/websiteNotes.json';
    import Header from "$lib/Header.svelte"
    import StarBackground from "$lib/StarBackground.svelte"

    let note = null;
    let displayNote = null;
    let content = '';
    let loading = false;
    const allNotes = websiteNotesData?.notes || [];

    marked.setOptions({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false
    });

    $: slug = $page.params.slug;
    $: note = allNotes.find((item) => item.slug === slug) || null;
    $: content = note ? marked.parse(note.content || '') : '';
    $: displayNote = note
        ? {
            ...note,
            filteredTags: Array.isArray(note.tags) ? note.tags.filter((t) => t && t.trim()) : []
        }
        : null;
</script>

<StarBackground>

<Header />
<main>
    <div class="column">
        <a href="/notes"><h2>back</h2></a>
        <hr class="horizontal-line">

        {#if loading}
            <p>Loading...</p>
        {:else if displayNote}
            <article>
                <header>
                    <h2 class="title">{displayNote.title}</h2>
                    <div class="meta-row">
                        {#if displayNote.filteredTags && displayNote.filteredTags.length > 0}
                            <div class="tags">
                                {#each displayNote.filteredTags as tag}
                                    <span class="tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                        <time class="date">
                            {new Date(displayNote.date).toLocaleDateString()}
                            {#if displayNote.edited}
                                <span class="edited">(edited {new Date(displayNote.edited).toLocaleDateString()})</span>
                            {/if}
                        </time>
                    </div>
                </header>
                <div class="content">
                    {@html content}
                </div>
            </article>
        {:else}
            <p>Note not found</p>
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
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        color: #666;
        font-size: 0.9rem;
    }

    .meta-row .date {
        margin-left: auto;
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

    .content :global(code) {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
    }

    .content :global(pre) {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1rem 0;
    }

    .content :global(pre code) {
        background: none;
        padding: 0;
    }

    .content :global(a) {
        color: var(--link-color, #0066cc);
        text-decoration: underline;
        transition: all 0.2s ease;
    }

    .content :global(a:hover) {
        opacity: 0.8;
    }

    .content :global(em) {
        font-style: italic;
    }

    .content :global(strong) {
        font-weight: bold;
    }

    .content :global(.footnote-ref) {
        text-decoration: none;
        font-size: 0.8em;
        color: var(--link-color, #0066cc);
        transition: all 0.2s ease;
    }

    .content :global(.footnote-ref:hover) {
        text-decoration: underline;
    }

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

    .content :global(img) {
        display: block;
        margin: 1.5rem auto;
        max-width: 100%;
        height: auto;
        border-radius: 4px;
    }
</style>
