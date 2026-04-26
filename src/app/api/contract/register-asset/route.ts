import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { registerAsset } from '../../../../server/contracts/assetRegistryService';

export const runtime = 'nodejs';

const registerAssetSchema = z.object({
  assetId: z.string().min(1),
  metadataUri: z.string().min(1),
  creator: z.string().min(1),
  isPrivate: z.boolean(),
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerAssetSchema.parse(body);
    const result = await registerAsset(input);

    if (result.success && result.assetIndex !== undefined) {
      // Save the asset to the database so it appears in the Explorer immediately
      await prisma.asset.create({
        data: {
          id: result.assetIndex.toString(),
          contractAssetId: result.assetIndex.toString(),
          metadataUri: input.metadataUri,
          creator: input.creator,
          owner: input.creator,
          isPrivate: input.isPrivate,
          verified: true,
          title: input.name || `Asset #${result.assetIndex}`,
          description: input.description || '',
          imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?auto=format&fit=crop&q=80&w=800',
          price: '0 ZERA',
          badges: ['verified'],
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
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

