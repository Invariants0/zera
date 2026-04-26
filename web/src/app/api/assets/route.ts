import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAsset, listAssets } from '@/server/assets/assetService';

export const runtime = 'nodejs';

const createAssetSchema = z.object({
  id: z.string().optional(),
  metadataUri: z.string().min(1),
  creator: z.string().min(1),
  isPrivate: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.string().optional(),
  badges: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verifiedParam = searchParams.get('verified');
  const privateParam = searchParams.get('private');
  const search = searchParams.get('search') || undefined;

  const data = await listAssets({
    verified: verifiedParam === null ? undefined : verifiedParam === 'true',
    private: privateParam === null ? undefined : privateParam === 'true',
    search,
  });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createAssetSchema.parse(body);
    const result = await createAsset(input);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create asset';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
