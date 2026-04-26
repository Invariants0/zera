import { NextResponse } from 'next/server';

import { listActivities } from '../../../../server/marketplace/marketplaceService';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') || '50', 10);
  return NextResponse.json(listActivities(Number.isFinite(limit) ? limit : 50), { status: 200 });
}
