import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buyListing } from '@/server/marketplace/marketplaceService';

export const runtime = 'nodejs';

const buySchema = z.object({
  listingId: z.string().min(1),
  buyer: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = buySchema.parse(body);
    const result = await buyListing(input);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to buy listing';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
