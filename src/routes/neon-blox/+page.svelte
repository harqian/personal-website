<script>
    import Header from "$lib/Header.svelte";
    import StarBackground from "$lib/StarBackground.svelte";
</script>

<svelte:head>
    <title>Neon Blox agents</title>
</svelte:head>

<StarBackground>
    <Header />
    <main>
        <div class="column">
            <h2>Neon Blox agents</h2>
            <hr class="horizontal-line">
            <p class="lede">
                I trained agents to play <a href="https://games.shnebir.com/neon-blox/" target="_blank" rel="noopener">Neon Blox</a>,
                a Flood-It puzzle (pick a color, absorb every connected cell of it; win by
                capturing all 112 cells within 20 moves). The interesting finding: with a perfect
                simulator you don't need reinforcement learning. A hand-written greedy heuristic
                wins 72%; <b>beam search</b> (planning ahead) wins ~100%; and a small net
                <b>distilled</b> from that planner wins 87% in a single forward pass, no search.
            </p>
            <p class="lede">
                Below, four agents play whatever seed you give them, live in the browser
                (including the distilled net's forward pass). Type a seed and step through.
            </p>

            <div class="frame-wrap">
                <iframe src="/neon-blox-demo.html" title="Neon Blox agents" loading="lazy"></iframe>
            </div>

            <p class="caption">
                use <kbd>←</kbd> <kbd>→</kbd> to step, <kbd>space</kbd> to play/pause.
            </p>

            <p class="links">
                <a href="https://games.shnebir.com/neon-blox/" target="_blank" rel="noopener">Play the original game</a>
            </p>
        </div>
    </main>
</StarBackground>

<style>
    .lede { color: var(--text-secondary); line-height: 1.55; margin: 1rem 0; }
    .lede a { color: var(--text); border-bottom: 1px solid var(--border-strong); text-decoration: none; }

    .frame-wrap {
        width: 100%; height: 880px; border-radius: 10px; overflow: hidden;
        background: #141416; border: 1px solid var(--border); margin-top: 0.5rem;
    }
    .frame-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }

    .caption { margin-top: 0.75rem; color: var(--text-faint); font-size: 0.85rem; text-align: center; }
    .links { margin-top: 1.5rem; font-size: 0.9rem; text-align: center; }
    .links a { color: var(--text-muted); text-decoration: none; border-bottom: 1px solid var(--border); }
    .links a:hover { color: var(--text); border-bottom-color: var(--border-strong); }

    kbd {
        display: inline-block; padding: 1px 6px; background: var(--surface-3);
        border: 1px solid var(--border-strong); border-radius: 4px; font-size: 0.8em;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .horizontal-line { border: none; height: 1px; background-color: var(--border); margin: 1.5rem 0; }
</style>
