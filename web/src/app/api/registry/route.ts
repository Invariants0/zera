import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const assets = await prisma.asset.findMany({
    where: { verified: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      creator: true,
      isPrivate: true,
      verified: true,
      updatedAt: true,
    },
  });

  const entries = assets.map((a) => ({
    id: a.id,
    creator: a.creator,
    verification: a.verified ? 'Verified' : 'Pending',
    ownership: a.isPrivate ? 'Private' : 'Provable',
    compliance: 'ZK-Certified',
    updated: a.updatedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  }));

  return NextResponse.json(entries, { status: 200 });
}
