import { NextResponse } from 'next/server';
import { assignOwnership } from '@/server/contracts/assetRegistryService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Assign ownership on-chain
    const result = await assignOwnership({ assetId: id });

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
        data: { owner: asset.creator } // Default back to creator for now
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
