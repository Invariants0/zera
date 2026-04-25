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
    const message = error instanceof Error ? error.message : 'Failed to register asset';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
