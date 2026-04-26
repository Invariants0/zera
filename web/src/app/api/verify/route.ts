import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyOwnershipById } from '../../../server/assets/assetService';

export const runtime = 'nodejs';

const verifySchema = z.object({
  assetId: z.string().min(1),
  ownerAddress: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = verifySchema.parse(body);
    const result = await verifyOwnershipById(input.assetId, input.ownerAddress);
    return NextResponse.json(result.data, { status: result.success ? 200 : 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify ownership';
    return NextResponse.json({ verified: false, error: message }, { status: 400 });
  }
}
