import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ownerAddress: string }> },
) {
  const { ownerAddress } = await params;

  // Local Dev Fix: Map the 'Alice' shielded address (000...00) to her hex public key (b26...)
  // so that synced assets from the local node appear in the 'My Assets' page.
  const isAlice = ownerAddress.startsWith('0000000000000000000000000000000000000000000000000000000000000000');
  const aliceHex = 'b26236c2575a7b0e24ed9a2d3a647555bcd6e512c73820d4d4dc16614bdcb277';
  
  const ownerQuery = isAlice 
    ? { OR: [{ owner: ownerAddress }, { owner: aliceHex }] }
    : { owner: ownerAddress };

  const [assets, activities] = await prisma.$transaction([
    prisma.asset.findMany({ where: ownerQuery }),
    prisma.activity.findMany({
      where: { OR: [{ to: ownerAddress }, isAlice ? { to: aliceHex } : {}] },
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
