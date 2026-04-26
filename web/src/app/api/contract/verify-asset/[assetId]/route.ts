import { NextResponse } from 'next/server';

import { verifyAssetAuthenticity } from '../../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  try {
    const { assetId } = await params;
    const result = await verifyAssetAuthenticity(assetId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify asset';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
