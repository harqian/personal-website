<script>

</script>

<slot />


<style>
    :global(.date) {
        color: white;
        font-size: 0.9em;
        white-space: nowrap;
        margin-left: 1rem;
    }
    
    :global(.tags) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    :global(.tag) {
        background: white;
        color: black;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.8em;
        white-space: nowrap;
    }

</style>