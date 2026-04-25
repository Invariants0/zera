import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyOwnership } from '../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

const verifyOwnershipSchema = z.object({
  assetId: z.string().min(1),
  claimedOwner: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = verifyOwnershipSchema.parse(body);
    const result = await verifyOwnership(input);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify ownership';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
