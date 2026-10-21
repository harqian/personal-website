// speaking.harrisonqian.com serves harrisonqian.com/speaking/ (the page itself is static/speaking/index.html)
export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== "/") return new Response("not found", { status: 404 })
    const page = await fetch("https://harrisonqian.com/speaking/")
    return new Response(page.body, { status: page.status, headers: { "content-type": "text/html; charset=utf-8" } })
  },
}
