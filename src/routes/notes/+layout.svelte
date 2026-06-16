<slot />

<style>
    :global(.date) {
        color: var(--text);
        font-size: 0.9em;
        white-space: nowrap;
        margin-left: 1rem;
    }

    :global(.edited) {
        opacity: 0.8;
        font-size: 0.9em;
    }

    :global(.tags) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    :global(.tag) {
        background: var(--text);
        color: var(--bg);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.8em;
        white-space: nowrap;
        display: inline-block;
        will-change: auto;
    }
</style>
