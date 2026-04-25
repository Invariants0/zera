import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const activities = await prisma.activity.findMany({
    where: { type: { in: ['TRANSFER', 'SALE', 'MINT'] } },
    orderBy: { timestamp: 'desc' },
    take: 100,
    include: { asset: { select: { title: true } } },
  });

  const rows = activities.map((a) => ({
    id: a.id,
    txHash: a.txHash ?? `0x${a.id.replace('act-', '')}`,
    asset: a.asset.title ?? a.assetId,
    assetId: a.assetId,
    from: a.from,
    to: a.to,
    value: a.price ?? (a.type === 'MINT' ? 'Minted' : '—'),
    type: a.type,
    status: 'Confirmed',
    time: a.timestamp.toISOString(),
  }));

  return NextResponse.json(rows, { status: 200 });
}
