import { NextResponse } from 'next/server';
import { z } from 'zod';

import { registerAsset } from '../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

const registerAssetSchema = z.object({
  assetId: z.string().min(1),
  metadataUri: z.string().min(1),
  creator: z.string().min(1),
  isPrivate: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerAssetSchema.parse(body);
    const result = await registerAsset(input);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Log the full error server-side so it's visible in the Next.js terminal
    console.error('[register-asset] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to register asset';
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack }),
      },
      { status: 400 },
    );
  }
}
