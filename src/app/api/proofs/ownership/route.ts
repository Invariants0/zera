import { NextResponse } from 'next/server';

import { getOwnershipProof } from '../../../../server/proofs/proofService';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId') || '';
    const owner = searchParams.get('owner') || undefined;

    if (!assetId) {
      return NextResponse.json({ success: false, message: 'assetId is required' }, { status: 400 });
    }

    const result = await getOwnershipProof(assetId, owner);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate ownership proof';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
