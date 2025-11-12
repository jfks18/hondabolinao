import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jsonDb = require('../../../../utils/jsonDb.js');

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
  return new NextResponse(JSON.stringify(body), { status, headers });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  const allowed = allowedOrigin(origin) || '*';
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const db = await jsonDb.loadDB();
    return jsonResponse(db, origin);
  } catch (err) {
    console.error('GET /api/inventory error', err);
    return jsonResponse({ inventory: [], promos: [] }, origin, 500);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || undefined;
  try {
    const payload = await req.json();

    // support bulk replace (array) or upsert single item/object with id
    if (Array.isArray(payload)) {
      // replace inventory array
      const db = await jsonDb.loadDB();
      db.inventory = payload;
      await jsonDb.saveDB(db);
      return jsonResponse(db, origin, 200);
    }

    if (payload && payload.id) {
      const updated = await jsonDb.upsertInventoryItem(payload);
      // return full db so client has promos too
      const db = await jsonDb.loadDB();
      return jsonResponse(db, origin, 200);
    }

    return jsonResponse({ error: 'Invalid payload' }, origin, 400);
  } catch (err) {
    console.error('POST /api/inventory error', err);
    return jsonResponse({ error: 'Bad request' }, origin, 400);
  }
}

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
import { NextResponse } from 'next/server';
import * as jsonDb from '../../../utils/jsonDb.js';

export const runtime = 'nodejs';

// GET -> return { inventory, promos }
export async function GET() {
  try {
    const db = await jsonDb.loadDB();
    return NextResponse.json(db);
  } catch (err) {
    return NextResponse.json({ inventory: [], promos: [] }, { status: 500 });
  }
}

// POST -> upsert inventory item or array of items
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // body can be a single item or an array of items
    await jsonDb.upsertInventoryItem(body);
    const inventory = await jsonDb.loadInventory();
    return NextResponse.json({ inventory });
  } catch (err: any) {
    console.error('POST /api/inventory error', err);
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 });
  }
}

// PUT -> update existing item by id (body contains the item with id)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: 'missing id' }, { status: 400 });
    }
    await jsonDb.upsertInventoryItem(body);
    const inventory = await jsonDb.loadInventory();
    const updated = inventory.find((i: any) => i.id === body.id) || null;
    return NextResponse.json({ updated });
  } catch (err: any) {
    console.error('PUT /api/inventory error', err);
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 });
  }
}
