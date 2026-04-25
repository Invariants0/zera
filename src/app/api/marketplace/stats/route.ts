import { NextResponse } from 'next/server';

import { getMarketplaceStats } from '../../../../server/marketplace/marketplaceService';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getMarketplaceStats(), { status: 200 });
}
