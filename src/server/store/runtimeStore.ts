export type AssetRecord = {
  id: string;
  contractAssetId: string | null;
  metadataUri: string;
  creator: string;
  owner: string;
  isPrivate: boolean;
  verified: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  badges?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ListingRecord = {
  id: string;
  assetId: string;
  seller: string;
  price: string;
  status: 'active' | 'sold' | 'cancelled';
  buyer?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityRecord = {
  id: string;
  type: 'mint' | 'transfer' | 'sale' | 'list';
  assetId: string;
  assetTitle: string;
  from: string;
  to: string;
  price?: string;
  timestamp: string;
};

export type ProofLogRecord = {
  id: string;
  kind: 'ownership' | 'eligibility';
  assetId?: string;
  wallet?: string;
  policy?: string;
  result: 'generated' | 'verified' | 'failed';
  createdAt: string;
};

export const runtimeStore = {
  assets: new Map<string, AssetRecord>(),
  listings: new Map<string, ListingRecord>(),
  activities: [] as ActivityRecord[],
  proofs: [] as ProofLogRecord[],
};
