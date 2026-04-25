import { NextResponse } from 'next/server';
import { z } from 'zod';

import { transferAsset } from '../../../../../server/assets/assetService';

export const runtime = 'nodejs';

const transferSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  price: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = transferSchema.parse(body);
    const result = await transferAsset(id, input.to, input.from, input.price);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to transfer asset';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
