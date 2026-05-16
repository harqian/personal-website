# personal-website

harrison's personal site at moonflowers.xyz. SvelteKit + Svelte 5 + Vite. fully static (no SSR), deployed via cloudflare pages.

## deploy architecture

two pieces, decoupled:

- **site shell + JS** → cloudflare pages, project `personal-website`, custom domain `moonflowers.xyz` (also `www.moonflowers.xyz`). adapter is `@sveltejs/adapter-static` with `fallback: 'index.html'` (SPA mode — every URL serves the shell, client router takes over).
- **media** (audio, video, images) → cloudflare R2 bucket `personal-website-media`, public via custom domain `assets.moonflowers.xyz`. all media URLs in code use `https://assets.moonflowers.xyz/<path>` via a per-file `const ASSETS = "https://assets.moonflowers.xyz"`.

a Vercel project also exists but is not the production deploy. moonflowers.xyz only points at cloudflare pages.

cloudflare account id: `b5767c459ae1102e08c8dd559b76ee15`. you almost always need this as an env var since wrangler sees multiple accounts.

## deploys

**auto-deploy on push to main** via GitHub Actions (`.github/workflows/deploy.yml`). every push to main runs `npm ci && npm run build && wrangler pages deploy build` on a github runner. takes ~1min total.

cloudflare pages itself has `Git Provider: No` — the GH Actions workflow is the only thing that talks to cloudflare. wrangler auths via the `CLOUDFLARE_API_TOKEN` GitHub repo secret (scoped to `Account:Cloudflare Pages:Edit` only).

**manual deploy** still works if you ever need to push a build from your laptop (e.g. testing a local change without committing):

```
npm run build
CLOUDFLARE_ACCOUNT_ID=b5767c459ae1102e08c8dd559b76ee15 \
  wrangler pages deploy build --project-name=personal-website --branch=main --commit-dirty=true
```

future code-only deploys take ~10s on cloudflare's side (dedupes by file hash). first deploys after a long gap are slow because nothing is cached.

## adding new media

new media must go to R2, not `static/`. workflow:

1. drop the file somewhere local
2. `rclone copy <file-or-dir> r2:personal-website-media/<remote-path> --transfers 8 --checkers 8`
3. reference it in code as `${ASSETS}/<remote-path>`
4. don't put it in `static/` — keeping that directory tiny is what makes pages deploys fast

rclone is pre-configured (remote name `r2`). credentials in 1password item `do63matvylpmx2h45g2copha3m` ("Cloudflare API token", Private vault) — that item now holds:
- `notesPlain`: R2 S3 access key + secret + endpoint (what rclone uses)
- `credential`: a CF API token scoped to R2 Object R/W on this bucket
- `pages_token`: a CF API token scoped to `Account:Cloudflare Pages:Edit` (mirrored to the `CLOUDFLARE_API_TOKEN` GitHub secret on `harqian/personal-website` — rotate both together)

source media backed up at `~/Desktop/personal-website-media-backup/`; R2 is canonical.

## verifying a live deploy

`curl https://moonflowers.xyz` returns the SPA shell, not page content. headings like "I LOVE MUSIC" exist only after JS runs. **use `agent-browser` for verification**, not curl/grep against the HTML.

## non-obvious gotchas

- **wrangler 4.x defaults to local-mock mode for r2 commands.** `wrangler r2 object put ...` silently uploads to a local mock instead of production. always pass `--remote`.
- **cloudflare REST API for R2 object PUT returns 500s** even on small files. use the S3-compatible API (rclone, aws cli, boto3) instead. the S3 endpoint is `https://b5767c459ae1102e08c8dd559b76ee15.r2.cloudflarestorage.com`.
- **Svelte's `muted={isMuted}` on `<video>` doesn't update the property after mount** (DOM `muted` attribute is sticky vs. property). both `Carousel.svelte` and `Gallery.svelte` work around this by binding videos via `bind:this` and imperatively setting `.muted` in the toggle handler.
- **`adapter-vercel` requires SvelteKit ≥ 2.27** (uses `kit.experimental.remoteFunctions`). older 2.x throws `Cannot read properties of undefined`.
- **transcoding small mp4s to webm usually makes them bigger.** social-media-sourced clips (TikTok/IG/YouTube rips) are already heavily compressed and don't benefit. only re-encode high-bitrate sources.
