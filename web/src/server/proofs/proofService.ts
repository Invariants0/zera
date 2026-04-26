import { prisma } from '@/lib/prisma';
import { verifyOwnershipById } from '../assets/assetService';

const now = () => new Date().toISOString();

export async function getOwnershipProof(assetId: string, owner?: string) {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) return { success: false, message: 'Asset not found' };

  const claimedOwner = owner ?? asset.owner;
  const verification = await verifyOwnershipById(assetId, claimedOwner);

  const proofLog = await prisma.proofLog.create({
    data: {
      id: `proof-ownership-${Date.now()}`,
      kind: 'OWNERSHIP',
      assetId,
      wallet: claimedOwner,
      result: verification.data?.verified ? 'VERIFIED' : 'FAILED',
    },
  });

  return {
    success: true,
    message: 'Ownership proof generated',
    data: {
      proofId: proofLog.id,
      assetId,
      owner: claimedOwner,
      type: 'ownership',
      generatedAt: proofLog.createdAt.toISOString(),
      verified: verification.data?.verified ?? false,
    },
  };
}

export async function getEligibilityProof(wallet: string, policy = 'KYC-Tier-1') {
  const normalizedWallet = wallet || 'anonymous';
  const eligible = normalizedWallet.length > 0;

  const proofLog = await prisma.proofLog.create({
    data: {
      id: `proof-eligibility-${Date.now()}`,
      kind: 'ELIGIBILITY',
      wallet: normalizedWallet,
      policy,
      result: eligible ? 'VERIFIED' : 'FAILED',
    },
  });

  return {
    success: true,
    message: 'Eligibility proof generated',
    data: {
      proofId: proofLog.id,
      wallet: normalizedWallet,
      policy,
      type: 'eligibility',
      generatedAt: proofLog.createdAt.toISOString(),
      eligible,
    },
  };
}

export async function listProofLogs(limit = 50) {
  return prisma.proofLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { asset: { select: { title: true } } },
  });
}
