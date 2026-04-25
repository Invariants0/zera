import { NextResponse } from 'next/server';

import { getAssetsByOwner } from '../../../../../server/assets/assetService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ownerAddress: string }> },
) {
  const { ownerAddress } = await params;
  const assets = getAssetsByOwner(ownerAddress);
  return NextResponse.json(assets, { status: 200 });
}
