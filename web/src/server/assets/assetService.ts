import { createHash } from 'node:crypto';
import {
  registerAsset,
  transferOwnership,
  assignOwnership,
  verifyAssetAuthenticity,
  verifyOwnership,
  assetExists,
  getAsset,
  readDeploymentAddress,
} from '../contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';
import type { Asset } from '@prisma/client';

type CreateAssetInput = {
  id?: string;
  metadataUri: string;
  creator: string;
  isPrivate: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  badges?: string[];
};

type ListAssetFilters = {
  verified?: boolean;
  private?: boolean;
  search?: string;
};

function toClientAsset(asset: Asset) {
  return {
    id: asset.id,
    ipfsCid: asset.ipfsCid,
    metadataHash: asset.metadataHash,
    title: asset.title ?? asset.id,
    description: asset.description ?? undefined,
    creator: asset.creator,
    owner: asset.owner,
    price: asset.price ?? '0 ZERA',
    imageUrl: asset.imageUrl ?? '',
    metadataUri: asset.metadataUri,
    badges: asset.badges ?? (asset.verified ? ['verified'] : []),
    verified: asset.verified,
    private: asset.isPrivate,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

export async function createAsset(input: CreateAssetInput) {
  const id = input.id?.trim() || `asset-${Date.now()}`;

  const onChain = await registerAsset({
    assetId: id,
    metadataUri: input.metadataUri,
    creator: input.creator,
    isPrivate: input.isPrivate,
  });

  // P2 FIX: Ensure ownership is assigned and transferred on-chain
  if (onChain.success && onChain.assetIndex) {
    try {
      console.log(`[DEBUG] Assigning ownership for asset index ${onChain.assetIndex}`);
      await assignOwnership({ assetId: onChain.assetIndex });
      
      console.log(`[DEBUG] Transferring ownership to ${input.creator}`);
      await transferOwnership({ 
        assetId: onChain.assetIndex, 
        from: 'registry', // not used by circuit, but for logging
        to: input.creator 
      });
    } catch (err) {
      console.error('Failed to set on-chain ownership during minting:', err);
    }
  }

  const record = await prisma.asset.create({
    data: {
      id,
      contractAssetId: onChain.assetIndex ?? null,
      metadataUri: input.metadataUri,
      creator: input.creator,
      owner: input.creator,
      isPrivate: input.isPrivate,
      verified: true,
      ipfsCid: input.metadataUri, // The metadataUri passed in is the CID
      metadataHash: createHash('sha256').update(input.metadataUri).digest('hex'),
      contractAddress: await readDeploymentAddress(),
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      price: input.price,
      badges: input.badges ?? [],
    },
  });

  await prisma.activity.create({
    data: {
      id: `act-${Date.now()}`,
      type: 'MINT',
      assetId: id,
      assetTitle: record.title ?? id,
      from: 'mint',
      to: input.creator,
      txHash: onChain.transactionHash,
      contractAddress: await readDeploymentAddress(),
    },
  });

  return {
    success: true,
    message: 'Asset created',
    data: {
      asset: toClientAsset(record),
      contract: onChain,
    },
  };
}

export async function listAssets(filters?: ListAssetFilters) {
  const currentAddress = await readDeploymentAddress();
  const where: Record<string, any> = {
    contractAddress: currentAddress,
  };

  if (typeof filters?.verified === 'boolean') where['verified'] = filters.verified;
  if (typeof filters?.private === 'boolean') where['isPrivate'] = filters.private;
  if (filters?.search) {
    const q = filters.search;
    where['OR'] = [
      { title: { contains: q, mode: 'insensitive' } },
      { creator: { contains: q, mode: 'insensitive' } },
      { id: { contains: q, mode: 'insensitive' } },
    ];
  }

  const assets = await prisma.asset.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return assets.map(toClientAsset);
}

export async function getAssetById(id: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return null;
  return toClientAsset(asset);
}

export async function getAssetsByOwner(ownerAddress: string) {
  const currentAddress = await readDeploymentAddress();
  const assets = await prisma.asset.findMany({
    where: { 
      owner: ownerAddress,
      contractAddress: currentAddress,
    },
    orderBy: { createdAt: 'desc' },
  });
  return assets.map(toClientAsset);
}

export async function verifyAssetById(id: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return { success: false, message: 'Asset not found', data: { verified: false } };
  if (!asset.contractAssetId) {
    return { success: true, message: 'Asset has no linked contract id yet', data: { verified: asset.verified } };
  }
  const result = await verifyAssetAuthenticity(asset.contractAssetId);
  return {
    success: true,
    message: 'Asset verification complete',
    data: { ...result.data, verified: (result.data as any)?.verified ?? asset.verified },
  };
}

export async function transferAsset(id: string, to: string, from: string, price?: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return { success: false, message: 'Asset not found' };
  if (!asset.contractAssetId) return { success: false, message: 'Asset has no contract asset id' };

  const tx = await transferOwnership({ assetId: asset.contractAssetId, from, to, price });

  const updated = await prisma.asset.update({
    where: { id },
    data: { owner: to },
  });

  await prisma.activity.create({
    data: {
      id: `act-${Date.now()}`,
      type: 'TRANSFER',
      assetId: id,
      assetTitle: asset.title ?? id,
      from,
      to,
      price,
      txHash: (tx as any)?.transactionHash,
      contractAddress: await readDeploymentAddress(),
    },
  });

  return {
    success: true,
    message: 'Asset ownership transferred',
    data: { transaction: tx, asset: toClientAsset(updated) },
  };
}

export async function verifyOwnershipById(id: string, ownerAddress: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset || !asset.contractAssetId) {
    return { success: false, message: 'Asset not found', data: { verified: false } };
  }
  const chainOwnership = await verifyOwnership({ assetId: asset.contractAssetId, claimedOwner: ownerAddress });
  return {
    success: true,
    message: 'Ownership checked',
    data: {
      verified: (chainOwnership.data as any)?.verified ?? false,
      proof: `ownership-proof-${id}-${Date.now()}`,
      contract: chainOwnership,
    },
  };
}

export async function syncAssetFromContract(id: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset || !asset.contractAssetId) return null;
  const exists = await assetExists(asset.contractAssetId);
  if (!exists.data?.exists) return null;
  const chainAsset = await getAsset(asset.contractAssetId);
  return chainAsset.data;
}
export async function deleteAsset(id: string) {
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return { success: false, message: 'Asset not found' };

  await prisma.activity.create({
    data: {
      id: `act-${Date.now()}`,
      type: 'BURN',
      assetId: id,
      assetTitle: asset.title ?? id,
      from: asset.owner,
      to: 'deleted',
    },
  });

  await prisma.asset.delete({ where: { id } });


  return { success: true, message: 'Asset removed from local database' };
}
