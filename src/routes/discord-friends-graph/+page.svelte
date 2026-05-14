<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>Discord Friends Graph</h2>
            <hr class="horizontal-line">
            <p class="lede">
                A Chrome extension I built that scans your Discord friends list
                and renders mutual connections as an interactive graph.
                Everything runs locally in the browser. The embed below is the
                public version of my own graph: names and profile links are
                hidden, but the structure is preserved.
            </p>

            <div class="frame-wrap">
                <iframe
                    src="/discord-friends-graph-demo.html"
                    title="Discord Friends Graph"
                    loading="lazy"
                ></iframe>
            </div>

            <p class="caption">
                drag to pan, scroll to zoom, click a node, press <kbd>/</kbd> to search.
            </p>

            <p class="links">
                <a href="https://github.com/harqian/discord-friends-graph" target="_blank" rel="noopener">Source on GitHub</a>
            </p>
        </div>
    </main>
</StarBackground>

<style>
    .lede {
        color: #ccc;
        line-height: 1.5;
        margin: 1rem 0 1.5rem 0;
    }

    code {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.35rem;
        border-radius: 3px;
        font-size: 0.85em;
    }

    .frame-wrap {
        width: 100%;
        height: 560px;
        border-radius: 10px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .frame-wrap iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
    }

    .caption {
        margin-top: 0.75rem;
        color: #888;
        font-size: 0.85rem;
        text-align: center;
    }

    .links {
        margin-top: 1.5rem;
        font-size: 0.9rem;
        text-align: center;
    }

    .links a {
        color: #aaa;
        text-decoration: none;
        border-bottom: 1px solid rgba(170, 170, 170, 0.3);
    }

    .links a:hover {
        color: #fff;
        border-bottom-color: #fff;
    }

    kbd {
        display: inline-block;
        padding: 1px 6px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 4px;
        font-size: 0.8em;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    .horizontal-line {
        border: none;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 1.5rem 0;
    }
</style>
