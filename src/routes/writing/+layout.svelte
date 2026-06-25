<script>

</script>

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
    
    :global(.subtitle) {
        color: var(--text-secondary);
        font-style: italic;
        font-size: 0.95em;
        margin-right: 1rem;
    }

</style>