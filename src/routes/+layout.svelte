<script>

</script>

<slot />

<svelte:head>
    <!-- import two different versions of font awesome so all the icons work -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <!-- Space Mono from google fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<style>
    :root {
        --link-color: #4da6ff;
        --blue-icon-shadow: rgb(33, 150, 243);
        --red-icon-shadow: rgb(244, 67, 54);
        --default-background: linear-gradient(to bottom, #050E1F, #1A0B2E);
        --dark-gray: #2f2f2f;
        --light-gray: #d6d6d6;
    }

    :global(*) {
        transition: width 0.3s ease-out;
    }

    /* Global styles (dark theme) */
    :global(body, html) {
        background-color: #000;
        color: #fff;
        margin: 0;
        padding: 0;
        font-family: "Space Mono", monospace;
        width: 100vw;
    }
    
    :global(a) {
        color: var(--link-color);
    }

    :global(h1) {
        text-align: left;
        font-size: 2rem;
        margin: 1.5rem 0;
    }
    
    :global(h2) {
        font-size: 1.5rem;
        margin: 1.3rem 0;
    }
    
    :global(h3) {
        font-size: 1.25rem;
        margin: 1.1rem 0;
    }
    
    :global(h4) {
        font-size: 1rem;
        margin: 1rem 0;
    }

    :global(.photo-wrapper-button) {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
        display: inline-block;
        line-height: 0;
        outline: none;
        position: relative;
        z-index: 1;
        transition: z-index 0s 0.5s; /* Delay z-index change until after animation */
    }

    :global(.text-wrapper-button) {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        width: 100%;
        text-align: left;
        font: inherit;
        color: inherit;
        cursor: pointer;
        display: inline-block;
        outline: none;
        position: relative;
        z-index: 1;
        transition: z-index 0s 0.5s; /* Delay z-index change until after animation */
    }

    :global(.column) {
        justify-content: space-between;
        margin: auto;
        width: 60%;
    }

    @media (max-width: 768px) {
        :global(.column) {
            width: 90%;
        }
    }

    :global(.horizontal-line) {
        border: none;
        height: 1px;
        background-color: var(--border-color, #ddd);
        margin: 1rem 0 2rem 0;
        width: 100%;
    }
</style>
