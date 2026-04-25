import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ownerAddress: string }> },
) {
  const { ownerAddress } = await params;

  const [assets, activities] = await prisma.$transaction([
    prisma.asset.findMany({ where: { owner: ownerAddress } }),
    prisma.activity.findMany({
      where: { to: ownerAddress },
      orderBy: { timestamp: 'desc' },
      take: 5,
    }),
  ]);

  const portfolioValue = assets.reduce((acc, a) => {
    const v = Number.parseFloat((a.price ?? '0').replace(/[^0-9.]/g, ''));
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);

  return NextResponse.json({
    ownerAddress,
    assets: assets.map((a) => ({
      id: a.id,
      title: a.title ?? a.id,
      description: a.description ?? undefined,
      creator: a.creator,
      owner: a.owner,
      price: a.price ?? '0 ZERA',
      imageUrl: a.imageUrl ?? '',
      metadataUri: a.metadataUri,
      badges: a.badges,
      verified: a.verified,
      private: a.isPrivate,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    portfolioValue: `${portfolioValue.toFixed(2)} ZERA`,
    recentActivity: activities,
  });
}
