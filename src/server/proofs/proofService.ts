import { runtimeStore } from '../store/runtimeStore';
import { verifyOwnershipById } from '../assets/assetService';

const now = () => new Date().toISOString();

export async function getOwnershipProof(assetId: string, owner?: string) {
  const asset = runtimeStore.assets.get(assetId);
  if (!asset) {
    return {
      success: false,
      message: 'Asset not found',
    };
  }

  const claimedOwner = owner || asset.owner;
  const verification = await verifyOwnershipById(assetId, claimedOwner);

  const proof = {
    proofId: `proof-ownership-${Date.now()}`,
    assetId,
    owner: claimedOwner,
    type: 'ownership',
    generatedAt: now(),
    verified: Boolean(verification.data?.verified),
  };

  runtimeStore.proofs.unshift({
    id: proof.proofId,
    kind: 'ownership',
    assetId,
    wallet: claimedOwner,
    result: proof.verified ? 'verified' : 'failed',
    createdAt: now(),
  });

  return {
    success: true,
    message: 'Ownership proof generated',
    data: proof,
  };
}

export function getEligibilityProof(wallet: string, policy = 'KYC-Tier-1') {
  const normalizedWallet = wallet || 'anonymous';
  const eligible = normalizedWallet.length > 0;

  const proof = {
    proofId: `proof-eligibility-${Date.now()}`,
    wallet: normalizedWallet,
    policy,
    type: 'eligibility',
    generatedAt: now(),
    eligible,
  };

  runtimeStore.proofs.unshift({
    id: proof.proofId,
    kind: 'eligibility',
    wallet: normalizedWallet,
    policy,
    result: eligible ? 'verified' : 'failed',
    createdAt: now(),
  });

  return {
    success: true,
    message: 'Eligibility proof generated',
    data: proof,
  };
}
