# setting up a custom domain on Railway with Cloudflare DNS

if you bought a domain on Hostinger (or another registrar) and deployed your app on Railway, you'll likely hit SSL/TLS issues because most registrars' DNS doesn't play well with Railway's automatic cert provisioning. the fix is to use Cloudflare as your DNS provider (free tier).

## the problem

Railway auto-provisions SSL certificates via Let's Encrypt for custom domains. this requires Railway's edge servers to respond to ACME challenges on your domain. registrars like Hostinger use ALIAS records for root domains, and their DNS resolution can break Railway's TLS handshake — you'll see "connection reset" errors on some networks.

## prerequisites

- a domain registered on Hostinger (or any registrar)
- a Railway app deployed and running
- a free Cloudflare account ([dash.cloudflare.com](https://dash.cloudflare.com))

## steps

### 1. get your Railway domain targets

in the Railway dashboard, go to your service → Settings → Custom Domains. add your domains if you haven't already:
- `yourdomain.com` (root)
- `www.yourdomain.com`

Railway will give you CNAME targets for each, like:
- `abc123.up.railway.app` (for root)
- `xyz789.up.railway.app` (for www)

save these — you'll need them.

### 2. add your domain to Cloudflare

1. go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. click **+ Add** → **Connect a domain**
3. enter your domain (e.g. `yourdomain.com`)
4. select the **Free** plan
5. Cloudflare will scan and import your existing DNS records

### 3. configure DNS records in Cloudflare

in the DNS → Records section, set up:

| type  | name  | content                     | proxy status        |
|-------|-------|-----------------------------|---------------------|
| CNAME | @     | `abc123.up.railway.app`     | DNS only (grey cloud) |
| CNAME | www   | `xyz789.up.railway.app`     | DNS only (grey cloud) |

keep any existing records you need:
- MX records (for email)
- TXT records (DKIM, SPF, domain verification, Railway verification)

**important:** set both CNAME records to **DNS only (grey cloud icon)**, not proxied. Railway needs direct access to provision SSL certs. you can turn the proxy on later.

### 4. update nameservers at your registrar

Cloudflare will give you two nameservers like:
- `charles.ns.cloudflare.com`
- `grannbo.ns.cloudflare.com`

go to your registrar (e.g. Hostinger) → domain settings → nameservers, and replace the existing nameservers with the Cloudflare ones.

### 5. wait for propagation

- nameserver changes can take up to 24 hours, but usually propagate within 30-60 minutes
- once Cloudflare is active, Railway will automatically provision SSL certificates via Let's Encrypt
- you can check propagation with: `dig yourdomain.com NS +short`

### 6. verify it works

```bash
# check DNS resolves correctly
dig yourdomain.com +short

# check HTTPS works
curl -sI https://yourdomain.com
```

you should see `server: railway-edge` in the response headers.

## things to avoid

- **don't repeatedly remove/re-add custom domains on Railway** — Let's Encrypt has rate limits (5 duplicate certs per domain per week). if you hit this, you're locked out for 7 days.
- **don't use Cloudflare's proxy (orange cloud) until SSL is working** — it interferes with Railway's cert provisioning.
- **don't use ALIAS or A records** — use CNAME only. Cloudflare handles CNAME flattening at the root automatically (which is the whole reason we're using Cloudflare).
