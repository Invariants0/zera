import { NextResponse } from 'next/server';
import { listAllOnChainAssets } from '@/server/contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const onChainAssets = await listAllOnChainAssets();
    let syncedCount = 0;

    for (const asset of onChainAssets) {
      const existing = await prisma.asset.findUnique({ where: { id: asset.id } });
      if (!existing) {
        await prisma.asset.create({
          data: {
            id: asset.id,
            contractAssetId: asset.id,
            metadataUri: asset.metadataHashHex,
            creator: asset.creatorPublicKeyHex,
            owner: asset.creatorPublicKeyHex,
            isPrivate: false,
            verified: true,
            title: `On-chain Asset #${asset.id}`,
            description: `Discovered on the Midnight Registry. Creator: ${asset.creatorPublicKeyHex}`,
            imageUrl: 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?auto=format&fit=crop&q=80&w=800',
            price: '0 ZERA',
            badges: ['verified'],
          },
        });
        syncedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. ${syncedCount} new assets found.`,
      totalOnChain: onChainAssets.length,
    });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    );
  }
}
