import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createListing, listListings } from '@/server/marketplace/marketplaceService';

export const runtime = 'nodejs';

const createListingSchema = z.object({
  assetId: z.string().min(1),
  seller: z.string().min(1),
  price: z.string().min(1),
});

export async function GET() {
  const listings = await listListings();
  return NextResponse.json(listings, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createListingSchema.parse(body);
    const result = await createListing(input);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create listing';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
