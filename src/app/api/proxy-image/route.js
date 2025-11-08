// app/api/proxy-image/route.js
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id'); // e.g. /api/proxy-image?id=690dd4fb...
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  // Build internal URL (only allow your trusted internal host)
  const upstream = `http://127.0.0.1:5000/api/v1/file/${encodeURIComponent(id)}`;

  try {
    const upstreamRes = await fetch(upstream);

    if (!upstreamRes.ok) {
      return new NextResponse('Upstream error', { status: upstreamRes.status });
    }

    // Forward headers you want (content-type, cache-control)
    const headers = new Headers();
    const contentType = upstreamRes.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    const cache = upstreamRes.headers.get('cache-control') || 'no-cache';
    headers.set('cache-control', cache);

    // Stream body to client
    return new NextResponse(upstreamRes.body, { status: 200, headers });
  } catch (err) {
    console.error('Proxy error', err);
    return NextResponse.json({ error: 'proxy failed' }, { status: 500 });
  }
}
