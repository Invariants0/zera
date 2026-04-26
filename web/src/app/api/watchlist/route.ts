import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const schema = z.object({
  userId: z.string().min(1),
  assetId: z.string().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const entries = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    entries.map((e) => ({
      watchlistId: e.id,
      ...e.asset,
      createdAt: e.asset.createdAt.toISOString(),
      updatedAt: e.asset.updatedAt.toISOString(),
    })),
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, assetId } = schema.parse(body);

    // Ensure user exists
    await prisma.user.upsert({
      where: { address: userId },
      update: {},
      create: { address: userId },
    });

    const entry = await prisma.watchlist.create({
      data: { userId, assetId },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Already in watchlist' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error?.message ?? 'Failed' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const assetId = searchParams.get('assetId');
    if (!userId || !assetId) return NextResponse.json({ error: 'userId and assetId required' }, { status: 400 });

    await prisma.watchlist.deleteMany({ where: { userId, assetId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message ?? 'Failed' }, { status: 400 });
  }
}
