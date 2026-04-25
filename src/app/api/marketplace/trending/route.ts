import { NextResponse } from 'next/server';

import { listListings } from '../../../../server/marketplace/marketplaceService';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') || '10', 10);
  const allListings = await listListings();
  const listings = allListings.slice(0, Number.isFinite(limit) ? limit : 10);
  return NextResponse.json(listings, { status: 200 });
}
