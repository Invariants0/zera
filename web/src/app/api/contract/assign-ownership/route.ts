import { NextResponse } from 'next/server';
import { z } from 'zod';

import { assignOwnership } from '../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

const assignOwnershipSchema = z.object({
  assetId: z.string().min(1),
  newOwner: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = assignOwnershipSchema.parse(body);
    const result = await assignOwnership(input);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to assign ownership';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
