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
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
  return new NextResponse(null, { status: 204, headers });
}

// GET -> return full DB ({ inventory, promos })
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const db = await jsonDb.loadDB();
    return jsonResponse(db, origin, 200);
  } catch (err) {
    console.error('GET /api/inventory error', err);
    return jsonResponse({ inventory: [], promos: [] }, origin, 500);
  }
}

// POST -> upsert single item or replace with array
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const payload = await req.json();

    if (Array.isArray(payload)) {
      const db = await jsonDb.loadDB();
      db.inventory = payload;
      await jsonDb.saveDB(db);
      return jsonResponse(db, origin, 200);
    }

    if (payload && payload.id) {
      await jsonDb.upsertInventoryItem(payload);
      const db = await jsonDb.loadDB();
      return jsonResponse(db, origin, 200);
    }

    return jsonResponse({ error: 'Invalid payload' }, origin, 400);
  } catch (err) {
    console.error('POST /api/inventory error', err);
    return jsonResponse({ error: 'Bad request' }, origin, 400);
  }
}

// PUT -> update existing by id
export async function PUT(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const payload = await req.json();
    if (!payload || !payload.id) return jsonResponse({ error: 'Missing id' }, origin, 400);
  await jsonDb.upsertInventoryItem(payload);
  const db = await jsonDb.loadDB();
  const inventory = db.inventory || [];
  const updated = inventory.find((i: any) => i.id === payload.id) || null;
    return jsonResponse({ updated }, origin, 200);
  } catch (err) {
    console.error('PUT /api/inventory error', err);
    return jsonResponse({ error: 'Failed' }, origin, 500);
  }
}

// DELETE -> remove by id (query param ?id=)
export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ error: 'Missing id' }, origin, 400);
    const db = await jsonDb.loadDB();
    db.inventory = (db.inventory || []).filter((i: any) => i.id !== id);
    await jsonDb.saveDB(db);
    return jsonResponse(db, origin, 200);
  } catch (err) {
    console.error('DELETE /api/inventory error', err);
    return jsonResponse({ error: 'Failed to delete' }, origin, 500);
  }
}
