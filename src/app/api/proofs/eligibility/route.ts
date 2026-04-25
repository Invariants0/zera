import { NextResponse } from 'next/server';

import { getEligibilityProof } from '../../../../server/proofs/proofService';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet') || '';
    const policy = searchParams.get('policy') || 'KYC-Tier-1';

    if (!wallet) {
      return NextResponse.json({ success: false, message: 'wallet is required' }, { status: 400 });
    }

    const result = getEligibilityProof(wallet, policy);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate eligibility proof';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
