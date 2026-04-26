import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const createPurchaseSchema = z.object({
  userId: z.string().min(1),
  assetId: z.string().min(1),
  price: z.string().min(1),
  txHash: z.string().optional(),
});

// Check if user has purchased an asset
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const assetId = searchParams.get('assetId');

    if (!userId || !assetId) {
      return NextResponse.json(
        { success: false, message: 'userId and assetId are required' },
        { status: 400 }
      );
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_assetId: {
          userId,
          assetId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      hasPurchased: !!purchase,
      purchase,
    });
  } catch (error) {
    console.error('Failed to check purchase:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check purchase' },
      { status: 500 }
    );
  }
}

// Record a new purchase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createPurchaseSchema.parse(body);

    // Check if purchase already exists
    const existing = await prisma.purchase.findUnique({
      where: {
        userId_assetId: {
          userId: input.userId,
          assetId: input.assetId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Purchase already recorded',
        purchase: existing,
      });
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: input.userId,
        assetId: input.assetId,
        price: input.price,
        txHash: input.txHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Purchase recorded successfully',
      purchase,
    });
  } catch (error) {
    console.error('Failed to record purchase:', error);
    const message = error instanceof Error ? error.message : 'Failed to record purchase';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
