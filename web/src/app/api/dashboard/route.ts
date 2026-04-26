import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerAddress = searchParams.get('owner');

  const [totalAssets, verifiedAssets, recentActivity, activeListings] = await prisma.$transaction([
    prisma.asset.count(),
    prisma.asset.count({ where: { verified: true } }),
    prisma.activity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: { asset: { select: { title: true } } },
    }),
    prisma.listing.count({ where: { status: 'ACTIVE' } }),
  ]);

  // Portfolio value for a specific owner
  let portfolioValue = '0.00 ZERA';
  let ownedCount = 0;
  if (ownerAddress) {
    const owned = await prisma.asset.findMany({ where: { owner: ownerAddress } });
    ownedCount = owned.length;
    const total = owned.reduce((acc, a) => {
      const v = Number.parseFloat((a.price ?? '0').replace(/[^0-9.]/g, ''));
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
    portfolioValue = `${total.toFixed(2)} ZERA`;
  }

  return NextResponse.json({
    totalAssets,
    verifiedAssets,
    pendingAssets: totalAssets - verifiedAssets,
    activeListings,
    portfolioValue,
    ownedCount,
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      type: a.type,
      asset: a.asset.title ?? a.assetId,
      assetId: a.assetId,
      from: a.from,
      to: a.to,
      price: a.price,
      txHash: a.txHash,
      time: a.timestamp.toISOString(),
    })),
  });
}
