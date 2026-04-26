import { NextResponse } from 'next/server';
import { listAllOnChainAssets, readDeploymentAddress, verifyOwnership } from '@/server/contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const walletAddress = body.walletAddress;
    
    const currentAddress = await readDeploymentAddress();
    const onChainAssets = await listAllOnChainAssets();
    let syncedCount = 0;
    let mappedCount = 0;

    for (const asset of onChainAssets) {
      const existing = await prisma.asset.findUnique({ where: { id: asset.id } });
      
      let isCurrentOwner = false;
      let isCreator = false;

      if (walletAddress) {
        // 1. Check for cryptographic creator match (Hex vs Hex)
        const walletHex = require('node:crypto')
          .createHash('sha256')
          .update(walletAddress.toLowerCase())
          .digest('hex');
        
        isCreator = (asset.creatorPublicKeyHex === walletHex);

        // 2. Check for cryptographic owner match (ZK Circuit)
        try {
          const verifyResult = await verifyOwnership({
            assetId: asset.id,
            claimedOwner: walletAddress
          });
          isCurrentOwner = verifyResult.verified;
        } catch (e) {
          console.warn(`[DEBUG] Sync: Ownership verification failed for asset ${asset.id}:`, e);
        }
      }

      // If they are the verified owner OR the creator (with no other owner assigned),
      // then we claim this for their Bech32 address in our DB.
      const shouldClaimAsBech32 = isCurrentOwner || isCreator;
      const ownerToStore = shouldClaimAsBech32 ? walletAddress : asset.ownerPublicKeyHex;

      if (!existing) {
        await prisma.asset.create({
          data: {
            id: asset.id,
            contractAssetId: asset.id,
            metadataUri: `hash:${asset.metadataHashHex}`,
            metadataHash: asset.metadataHashHex,
            contractAddress: currentAddress,
            creator: isCreator ? walletAddress : asset.creatorPublicKeyHex,
            owner: ownerToStore,
            isPrivate: false,
            verified: true,
            title: `Asset #${asset.id}`,
            description: `Discovered on the Midnight Registry. ID: ${asset.id}`,
            imageUrl: 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?auto=format&fit=crop&q=80&w=800',
            price: '1.5 ZERA',
            badges: ['verified'],
          },
        });
        syncedCount++;
      } else {
        const needsUpdate = existing.contractAddress !== currentAddress || 
                           (walletAddress && existing.owner !== walletAddress && isCurrentOwner);
        
        if (needsUpdate) {
          await prisma.asset.update({
            where: { id: asset.id },
            data: {
              contractAddress: currentAddress,
              contractAssetId: asset.id,
              owner: ownerToStore,
              creator: isCreator ? walletAddress : (existing.creator.startsWith('mn_') ? existing.creator : asset.creatorPublicKeyHex),
              verified: true,
            }
          });
          mappedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. ${syncedCount} new assets, ${mappedCount} ownership mappings updated.`,
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
