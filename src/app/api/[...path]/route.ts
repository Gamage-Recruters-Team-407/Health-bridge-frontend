export const runtime = "nodejs";

async function forward(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const backend = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8088/api").replace(/\/$/, "");
  const target = `${backend}/${path.map(encodeURIComponent).join("/")}${new URL(request.url).search}`;
  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(target, {
      method: request.method, headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      signal: controller.signal, cache: "no-store", redirect: "manual",
    });
    const body = request.method === "HEAD" || [204, 304].includes(response.status)
      ? null : await response.arrayBuffer();
    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "content-disposition", "retry-after", "www-authenticate"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(body, { status: response.status, headers: responseHeaders });
  } catch {
    return Response.json({ status: 503, message: "The backend is temporarily unavailable or took too long to respond. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "5", "Cache-Control": "no-store" } });
  } finally { clearTimeout(timer); }
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE, forward as HEAD, forward as OPTIONS };
