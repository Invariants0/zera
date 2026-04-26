import { NextResponse } from 'next/server';
import { z } from 'zod';

import { transferOwnership } from '../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

const transferOwnershipSchema = z.object({
  assetId: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  price: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = transferOwnershipSchema.parse(body);
    const result = await transferOwnership(input);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to transfer ownership';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
