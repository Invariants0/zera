import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOwnershipProof, listProofLogs } from '@/server/proofs/proofService';

export const runtime = 'nodejs';

const proofSchema = z.object({
  assetId: z.string().min(1),
  owner: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '50');
  const logs = await listProofLogs(limit);

  const rows = logs.map((log) => ({
    id: log.id,
    asset: log.asset?.title ?? log.assetId ?? '—',
    type: log.kind === 'OWNERSHIP' ? 'Ownership (ZK)' : 'Transfer Eligibility',
    user: log.wallet ? `${log.wallet.slice(0, 8)}...` : 'Hidden',
    time: log.createdAt.toISOString(),
    status: log.result === 'VERIFIED' ? 'Success' : log.result === 'GENERATED' ? 'Success' : 'Failed',
  }));

  return NextResponse.json(rows, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = proofSchema.parse(body);
    const result = await getOwnershipProof(input.assetId, input.owner);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate ownership proof';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
