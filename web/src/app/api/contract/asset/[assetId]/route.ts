import { NextResponse } from 'next/server';

import { getAsset } from '../../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  try {
    const { assetId } = await params;
    const result = await getAsset(assetId);
    const status = result.success ? 200 : 404;
    return NextResponse.json(result, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch asset';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
