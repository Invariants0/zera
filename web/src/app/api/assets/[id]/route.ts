import { NextResponse } from 'next/server';

import { getAssetById, deleteAsset } from '@/server/assets/assetService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = await getAssetById(id);

  if (!asset) {
    return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
  }

  return NextResponse.json(asset, { status: 200 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await deleteAsset(id);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}
