import { prisma } from '@/lib/prisma';
import { transferOwnership } from '../contracts/assetRegistryService';

const now = () => new Date().toISOString();

type CreateListingInput = {
  assetId: string;
  seller: string;
  price: string;
};

type BuyListingInput = {
  listingId: string;
  buyer: string;
};

export async function createListing(input: CreateListingInput) {
  const asset = await prisma.asset.findUnique({ where: { id: input.assetId } });
  if (!asset) return { success: false, message: 'Asset not found' };
  if (!asset.verified) return { success: false, message: 'Only verified assets can be listed' };
  if (asset.owner !== input.seller) return { success: false, message: 'Seller is not current owner' };

  const listing = await prisma.listing.create({
    data: {
      id: `listing-${Date.now()}`,
      assetId: input.assetId,
      seller: input.seller,
      price: input.price,
      status: 'ACTIVE',
    },
  });

  await prisma.activity.create({
    data: {
      id: `act-${Date.now()}`,
      type: 'LIST',
      assetId: input.assetId,
      assetTitle: asset.title ?? asset.id,
      from: input.seller,
      to: 'marketplace',
      price: input.price,
    },
  });

  return { success: true, message: 'Listing created', data: listing };
}

export async function cancelListing(listingId: string, seller: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return { success: false, message: 'Listing not found' };
  if (listing.seller !== seller) return { success: false, message: 'Seller mismatch' };

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'CANCELLED' },
  });

  return { success: true, message: 'Listing cancelled', data: updated };
}

export async function buyListing(input: BuyListingInput) {
  const listing = await prisma.listing.findUnique({
    where: { id: input.listingId },
    include: { asset: true },
  });

  if (!listing || listing.status !== 'ACTIVE') {
    return { success: false, message: 'Listing is not active' };
  }

  const asset = listing.asset;

  // Call Midnight contract immediately
  let txHash: string | undefined;
  if (asset.contractAssetId) {
    try {
      const tx = await transferOwnership({
        assetId: asset.contractAssetId,
        from: listing.seller,
        to: input.buyer,
        price: listing.price,
      });
      txHash = (tx as any)?.transactionHash;
    } catch (err) {
      return { success: false, message: `Midnight transfer failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  const [updatedListing, updatedAsset] = await prisma.$transaction([
    prisma.listing.update({
      where: { id: input.listingId },
      data: { status: 'SOLD', buyer: input.buyer, txHash },
    }),
    prisma.asset.update({
      where: { id: asset.id },
      data: { owner: input.buyer },
    }),
  ]);

  await prisma.activity.create({
    data: {
      id: `act-${Date.now()}`,
      type: 'SALE',
      assetId: asset.id,
      assetTitle: asset.title ?? asset.id,
      from: listing.seller,
      to: input.buyer,
      price: listing.price,
      txHash,
    },
  });

  return { success: true, message: 'Listing purchased', data: { listing: updatedListing, asset: updatedAsset } };
}

export async function listListings() {
  return prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: { asset: true },
  });
}

export async function listActivities(limit: number) {
  return prisma.activity.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

export async function getMarketplaceStats() {
  const [sold, allListings, allAssets] = await prisma.$transaction([
    prisma.listing.findMany({ where: { status: 'SOLD' } }),
    prisma.listing.findMany(),
    prisma.asset.findMany({ select: { owner: true } }),
  ]);

  const totalVolume = sold.reduce((acc, entry) => {
    const value = Number.parseFloat(entry.price.replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? acc + value : acc;
  }, 0);

  const uniqueOwners = new Set(allAssets.map((a) => a.owner)).size;

  return {
    totalVolume: `${totalVolume.toFixed(2)} ZERA`,
    totalSales: sold.length,
    activeListings: allListings.filter((l) => l.status === 'ACTIVE').length,
    uniqueOwners,
  };
}
