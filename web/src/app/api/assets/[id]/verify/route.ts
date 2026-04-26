import { NextResponse } from 'next/server';

import { verifyAssetById } from '../../../../../server/assets/assetService';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner') ?? undefined;

    const result = await verifyAssetById(id);
    return NextResponse.json(
      {
        ...result,
        data: {
          ...result.data,
          owner,
        },
      },
      { status: result.success ? 200 : 404 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify asset';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
