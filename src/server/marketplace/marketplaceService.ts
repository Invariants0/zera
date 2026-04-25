import { runtimeStore } from '../store/runtimeStore';

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

export function createListing(input: CreateListingInput) {
  const asset = runtimeStore.assets.get(input.assetId);
  if (!asset) {
    return { success: false, message: 'Asset not found' };
  }

  if (!asset.verified) {
    return { success: false, message: 'Only verified assets can be listed' };
  }

  if (asset.owner !== input.seller) {
    return { success: false, message: 'Seller is not current owner' };
  }

  const id = `listing-${Date.now()}`;
  const listing = {
    id,
    assetId: input.assetId,
    seller: input.seller,
    price: input.price,
    status: 'active' as const,
    createdAt: now(),
    updatedAt: now(),
  };

  runtimeStore.listings.set(id, listing);
  runtimeStore.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'list',
    assetId: input.assetId,
    assetTitle: asset.title ?? asset.id,
    from: input.seller,
    to: 'marketplace',
    price: input.price,
    timestamp: now(),
  });

  return { success: true, message: 'Listing created', data: listing };
}

export function cancelListing(listingId: string, seller: string) {
  const listing = runtimeStore.listings.get(listingId);
  if (!listing) {
    return { success: false, message: 'Listing not found' };
  }

  if (listing.seller !== seller) {
    return { success: false, message: 'Seller mismatch' };
  }

  listing.status = 'cancelled';
  listing.updatedAt = now();
  runtimeStore.listings.set(listingId, listing);

  return { success: true, message: 'Listing cancelled', data: listing };
}

export function buyListing(input: BuyListingInput) {
  const listing = runtimeStore.listings.get(input.listingId);
  if (!listing || listing.status !== 'active') {
    return { success: false, message: 'Listing is not active' };
  }

  const asset = runtimeStore.assets.get(listing.assetId);
  if (!asset) {
    return { success: false, message: 'Asset not found for listing' };
  }

  listing.status = 'sold';
  listing.buyer = input.buyer;
  listing.updatedAt = now();
  runtimeStore.listings.set(input.listingId, listing);

  const previousOwner = asset.owner;
  asset.owner = input.buyer;
  asset.updatedAt = now();
  runtimeStore.assets.set(asset.id, asset);

  runtimeStore.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'sale',
    assetId: asset.id,
    assetTitle: asset.title ?? asset.id,
    from: previousOwner,
    to: input.buyer,
    price: listing.price,
    timestamp: now(),
  });

  return {
    success: true,
    message: 'Listing purchased',
    data: {
      listing,
      asset,
    },
  };
}

export function listListings() {
  return Array.from(runtimeStore.listings.values())
    .filter((entry) => entry.status === 'active')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function listActivities(limit: number) {
  return runtimeStore.activities.slice(0, limit);
}

export function getMarketplaceStats() {
  const listings = Array.from(runtimeStore.listings.values());
  const sold = listings.filter((entry) => entry.status === 'sold');

  const totalVolume = sold.reduce((acc, entry) => {
    const value = Number.parseFloat(entry.price.replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? acc + value : acc;
  }, 0);

  const uniqueOwners = new Set(Array.from(runtimeStore.assets.values()).map((asset) => asset.owner)).size;

  return {
    totalVolume: `${totalVolume.toFixed(2)} ZERA`,
    totalSales: sold.length,
    activeListings: listings.filter((entry) => entry.status === 'active').length,
    uniqueOwners,
  };
}
