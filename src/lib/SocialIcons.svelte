<script>
    export let size = "fa-2x"
    export let iconInfos
</script>

<div class="social-icons">
    {#each iconInfos as iconInfo}
        <a
            href={iconInfo.href}
            target="_blank"
            aria-label={iconInfo.description}
        >
            {#if iconInfo.font_awesome_tag}
                <i
                    class="{iconInfo.font_awesome_tag} {size} icon-3d"
                    role="presentation"
                ></i>
            {:else if iconInfo.custom_icon === "curius"}
                <span class="{size} icon-3d-svg" role="presentation">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <mask id="curius-cut">
                            <rect width="100" height="100" fill="white" />
                            <rect x="5" y="5" width="60" height="60" rx="10" fill="black" />
                        </mask>
                        <rect x="35" y="35" width="60" height="60" rx="10" fill="currentColor" mask="url(#curius-cut)" />
                        <rect x="5" y="5" width="60" height="60" rx="10" fill="none" stroke="currentColor" stroke-width="8" />
                    </svg>
                </span>
            {/if}
        </a>
    {/each}
</div>

<style>
    /* credit: https://codepen.io/miguelcast/pen/pwZMOJ  */
    .icon-3d {
        padding: 10px;
        animation: icon3d 200ms 10;
        color: #fff;
    }

    .icon-3d:hover {
        animation: icon3d 200ms infinite;
    }

    @keyframes icon3d {
        0% {
            text-shadow:
                5px 4px var(--red-icon-shadow),
                -5px -6px var(--blue-icon-shadow);
        }
        25% {
            text-shadow:
                -5px -6px var(--red-icon-shadow),
                5px 4px var(--blue-icon-shadow);
        }
        50% {
            text-shadow:
                5px -4px var(--red-icon-shadow),
                -8px 4px var(--blue-icon-shadow);
        }
        75% {
            text-shadow:
                -8px -4px var(--red-icon-shadow),
                -5px -4px var(--blue-icon-shadow);
        }
        100% {
            text-shadow:
                -5px 0 var(--red-icon-shadow),
                5px -4px var(--blue-icon-shadow);
        }
    }

    .social-icons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
    }

    /* svg icons mirror the .icon-3d effect using drop-shadow,
       since text-shadow doesn't apply to vector paths */
    .icon-3d-svg {
        padding: 10px;
        color: #fff;
        display: inline-flex;
        animation: icon3d-svg 200ms 10;
    }

    .icon-3d-svg:hover {
        animation: icon3d-svg 200ms infinite;
    }

    .icon-3d-svg svg {
        width: 1em;
        height: 1em;
    }

    /* fa-2x is 2em; match it for the svg wrapper */
    .icon-3d-svg.fa-2x {
        font-size: 2em;
    }

    @keyframes icon3d-svg {
        0% {
            filter:
                drop-shadow(5px 4px var(--red-icon-shadow))
                drop-shadow(-5px -6px var(--blue-icon-shadow));
        }
        25% {
            filter:
                drop-shadow(-5px -6px var(--red-icon-shadow))
                drop-shadow(5px 4px var(--blue-icon-shadow));
        }
        50% {
            filter:
                drop-shadow(5px -4px var(--red-icon-shadow))
                drop-shadow(-8px 4px var(--blue-icon-shadow));
        }
        75% {
            filter:
                drop-shadow(-8px -4px var(--red-icon-shadow))
                drop-shadow(-5px -4px var(--blue-icon-shadow));
        }
        100% {
            filter:
                drop-shadow(-5px 0 var(--red-icon-shadow))
                drop-shadow(5px -4px var(--blue-icon-shadow));
        }
    }
</style>
