import { NextResponse } from 'next/server';

import { listAssets } from '../../../server/assets/assetService';

export const runtime = 'nodejs';

export async function GET() {
  const rows = listAssets().map((asset) => ({
    id: asset.id,
    creator: asset.creator,
    verification: asset.verified ? 'Verified' : 'Pending',
    ownership: asset.private ? 'Private' : 'Provable',
    compliance: asset.private ? 'KYC-Tier-1' : 'Unrestricted',
    updated: asset.updatedAt,
  }));

  return NextResponse.json(rows, { status: 200 });
}
