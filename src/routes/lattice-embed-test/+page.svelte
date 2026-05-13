<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
</script>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>Discord Lattice embed test</h2>
            <hr class="horizontal-line">
            <p class="lede">
                A Chrome extension that scans your Discord friends list and
                renders mutual connections as an interactive graph. Everything
                runs locally; this embed is a self-contained <code>.html</code>
                file with the graph + viewer code baked in.
            </p>

            <div class="frame-wrap">
                <iframe
                    src="/discord-lattice-demo.html"
                    title="Discord Friends Graph"
                    loading="lazy"
                ></iframe>
            </div>

            <p class="caption">
                drag to pan, scroll to zoom, click a node to see profile,
                press <kbd>/</kbd> to search.
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
