import { NextResponse } from 'next/server';

import { getAssetById } from '../../../../server/assets/assetService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = getAssetById(id);

  if (!asset) {
    return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
  }

  return NextResponse.json(asset, { status: 200 });
}
