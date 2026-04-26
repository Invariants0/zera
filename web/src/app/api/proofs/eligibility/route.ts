import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getEligibilityProof } from '@/server/proofs/proofService';

export const runtime = 'nodejs';

const eligibilitySchema = z.object({
  wallet: z.string().min(1),
  policy: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = eligibilitySchema.parse(body);
    const result = await getEligibilityProof(input.wallet, input.policy);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate eligibility proof';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
