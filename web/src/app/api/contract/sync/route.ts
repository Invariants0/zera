import { NextResponse } from 'next/server';
import { listAllOnChainAssets, readDeploymentAddress } from '@/server/contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const currentAddress = await readDeploymentAddress();
    const onChainAssets = await listAllOnChainAssets();
    let syncedCount = 0;

    for (const asset of onChainAssets) {
      const existing = await prisma.asset.findUnique({ where: { id: asset.id } });
      if (!existing) {
        // Ensure creator/owner exists as a user
        await prisma.user.upsert({
          where: { address: asset.creatorPublicKeyHex },
          update: {},
          create: {
            address: asset.creatorPublicKeyHex,
            username: `user_${asset.creatorPublicKeyHex.slice(0, 8)}`,
          },
        });

        // Since we can't reverse the sha256 metadataHash to get the IPFS CID, 
        // we use a placeholder until the user updates it, OR if it's found in off-chain DB it wouldn't hit this.
        await prisma.asset.create({
          data: {
            id: asset.id,
            contractAssetId: asset.id,
            metadataUri: `hash:${asset.metadataHashHex}`,
            metadataHash: asset.metadataHashHex,
            contractAddress: currentAddress,
            creator: asset.creatorPublicKeyHex,
            owner: asset.creatorPublicKeyHex,
            isPrivate: false,
            verified: true,
            title: `Asset #${asset.id}`,
            description: `Discovered on the Midnight Registry. Creator: ${asset.creatorPublicKeyHex.substring(0, 12)}...`,
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
