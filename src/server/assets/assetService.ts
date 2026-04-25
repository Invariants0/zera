import {
  assetExists,
  getAsset,
  registerAsset,
  transferOwnership,
  verifyAssetAuthenticity,
  verifyOwnership,
} from '../contracts/assetRegistryService';
import { runtimeStore, type AssetRecord } from '../store/runtimeStore';

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

const now = () => new Date().toISOString();

function toClientAsset(asset: AssetRecord) {
  return {
    id: asset.id,
    title: asset.title ?? asset.id,
    description: asset.description,
    creator: asset.creator,
    owner: asset.owner,
    price: asset.price ?? '0 ZERA',
    imageUrl: asset.imageUrl ?? '',
    metadataUri: asset.metadataUri,
    badges: asset.badges ?? (asset.verified ? ['verified'] : []),
    verified: asset.verified,
    private: asset.isPrivate,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
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

  const record: AssetRecord = {
    id,
    contractAssetId: onChain.assetIndex ?? null,
    metadataUri: input.metadataUri,
    creator: input.creator,
    owner: input.creator,
    isPrivate: input.isPrivate,
    verified: true,
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    price: input.price,
    badges: input.badges,
    createdAt: now(),
    updatedAt: now(),
  };

  runtimeStore.assets.set(id, record);
  runtimeStore.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'mint',
    assetId: id,
    assetTitle: record.title ?? id,
    from: 'mint',
    to: input.creator,
    timestamp: now(),
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

export function listAssets(filters?: ListAssetFilters) {
  let values = Array.from(runtimeStore.assets.values());

  if (typeof filters?.verified === 'boolean') {
    values = values.filter((asset) => asset.verified === filters.verified);
  }

  if (typeof filters?.private === 'boolean') {
    values = values.filter((asset) => asset.isPrivate === filters.private);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    values = values.filter((asset) => {
      const title = (asset.title ?? '').toLowerCase();
      const creator = asset.creator.toLowerCase();
      const id = asset.id.toLowerCase();
      return title.includes(q) || creator.includes(q) || id.includes(q);
    });
  }

  return values.map(toClientAsset);
}

export function getAssetById(id: string) {
  const asset = runtimeStore.assets.get(id);
  if (!asset) {
    return null;
  }
  return toClientAsset(asset);
}

export function getAssetsByOwner(ownerAddress: string) {
  return Array.from(runtimeStore.assets.values())
    .filter((asset) => asset.owner === ownerAddress)
    .map(toClientAsset);
}

export async function verifyAssetById(id: string) {
  const asset = runtimeStore.assets.get(id);
  if (!asset) {
    return {
      success: false,
      message: 'Asset not found',
      data: { verified: false },
    };
  }

  if (!asset.contractAssetId) {
    return {
      success: true,
      message: 'Asset has no linked contract id yet',
      data: { verified: asset.verified },
    };
  }

  const result = await verifyAssetAuthenticity(asset.contractAssetId);
  return {
    success: true,
    message: 'Asset verification complete',
    data: {
      ...result.data,
      verified: result.data?.verified ?? asset.verified,
    },
  };
}

export async function transferAsset(id: string, to: string, from: string, price?: string) {
  const asset = runtimeStore.assets.get(id);
  if (!asset) {
    return {
      success: false,
      message: 'Asset not found',
    };
  }

  if (!asset.contractAssetId) {
    return {
      success: false,
      message: 'Asset does not have a contract asset id for transfer',
    };
  }

  const tx = await transferOwnership({
    assetId: asset.contractAssetId,
    from,
    to,
    price,
  });

  asset.owner = to;
  asset.updatedAt = now();
  runtimeStore.assets.set(id, asset);

  runtimeStore.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'transfer',
    assetId: id,
    assetTitle: asset.title ?? id,
    from,
    to,
    price,
    timestamp: now(),
  });

  return {
    success: true,
    message: 'Asset ownership transferred',
    data: {
      transaction: tx,
      asset: toClientAsset(asset),
    },
  };
}

export async function verifyOwnershipById(id: string, ownerAddress: string) {
  const asset = runtimeStore.assets.get(id);
  if (!asset || !asset.contractAssetId) {
    return {
      success: false,
      message: 'Asset not found',
      data: {
        verified: false,
      },
    };
  }

  const chainOwnership = await verifyOwnership({
    assetId: asset.contractAssetId,
    claimedOwner: ownerAddress,
  });

  return {
    success: true,
    message: 'Ownership checked',
    data: {
      verified: chainOwnership.data?.verified ?? false,
      proof: `ownership-proof-${id}-${Date.now()}`,
      contract: chainOwnership,
    },
  };
}

export async function syncAssetFromContract(id: string) {
  const asset = runtimeStore.assets.get(id);
  if (!asset || !asset.contractAssetId) {
    return null;
  }

  const exists = await assetExists(asset.contractAssetId);
  if (!exists.data?.exists) {
    return null;
  }

  const chainAsset = await getAsset(asset.contractAssetId);
  return chainAsset.data;
}
