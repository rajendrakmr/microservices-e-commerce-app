import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Runtime proxy: browser -> Next.js (/api/*) -> gateway service.
// GATEWAY_URL is read at request time so one image works in every environment.
async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const gateway = process.env.GATEWAY_URL ?? 'http://gateway:8080';
  const url = `${gateway}/api/${params.path.join('/')}${req.nextUrl.search}`;
  try {
    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const upstream = await fetch(url, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'gateway unavailable' }, { status: 502 });
  }
}
export { handler as GET, handler as POST };
