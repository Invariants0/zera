import { NextResponse } from 'next/server';
import { claimAsset } from '@/server/contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const walletAddress = body.walletAddress;

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: 'Wallet address required' }, { status: 400 });
    }

    // 1. Claim/Transfer ownership on-chain
    const result = await claimAsset({ 
      assetId: id,
      claimantAddress: walletAddress 
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // 2. Update local database if successful
    // We assume the caller (backend wallet) is now the owner.
    // In a real app, we'd verify the wallet address.
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (asset) {
      await prisma.asset.update({
        where: { id },
        data: { owner: walletAddress }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Ownership claimed successfully on-chain',
      transactionHash: result.transactionHash
    });
  } catch (error) {
    console.error('Claim ownership failed:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Claim failed' },
      { status: 500 }
    );
  }
}
