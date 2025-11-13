import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jsonDb = require('../../../utils/jsonDb.js');

export const runtime = 'nodejs';

const ALLOWED = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean);

function allowedOrigin(origin?: string) {
  if (!origin) return null;
  if (!ALLOWED.length) return origin;
  return ALLOWED.includes(origin) ? origin : null;
}

function jsonResponse(body: any, origin?: string, status = 200) {
  const o = allowedOrigin(origin) || '*';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin'
  };
  if (o !== '*') headers['Access-Control-Allow-Credentials'] = 'true';
  return NextResponse.json(body, { status, headers });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  const allowed = allowedOrigin(origin) || '*';
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Authorization, X-Requested-With',
    'Vary': 'Origin'
  };
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const db = await jsonDb.loadDB();
    return jsonResponse({ promos: db.promos || [] }, origin, 200);
  } catch (err) {
    console.error('GET /api/promo error', err);
    return jsonResponse({ promos: [] }, origin, 500);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const payload = await req.json();
    if (!payload || !payload.id) return jsonResponse({ error: 'Invalid payload' }, origin, 400);

    await jsonDb.upsertPromo(payload);
    const db = await jsonDb.loadDB();
    return jsonResponse({ promos: db.promos || [] }, origin, 200);
  } catch (err) {
    console.error('POST /api/promo error', err);
    return jsonResponse({ error: 'Bad request' }, origin, 400);
  }
}

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ error: 'Missing id' }, origin, 400);

    await jsonDb.deletePromo(id);
    const db = await jsonDb.loadDB();
    return jsonResponse({ promos: db.promos || [] }, origin, 200);
  } catch (err) {
    console.error('DELETE /api/promo error', err);
    return jsonResponse({ error: 'Failed to delete' }, origin, 500);
  }
}
