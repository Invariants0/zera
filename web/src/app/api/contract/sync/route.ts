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
      
      // Ensure creator/owner exists as a user
      await prisma.user.upsert({
        where: { address: asset.creatorPublicKeyHex },
        update: {},
        create: {
          address: asset.creatorPublicKeyHex,
          username: `user_${asset.creatorPublicKeyHex.slice(0, 8)}`,
        },
      });

      if (!existing) {
        // Create new asset record
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
      } else if (existing.contractAddress !== currentAddress) {
        // Update existing asset to point to the new contract instance
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            contractAddress: currentAddress,
            contractAssetId: asset.id,
            owner: asset.creatorPublicKeyHex, // Reset owner to creator on new contract if no commitment found yet
            verified: true,
          }
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
