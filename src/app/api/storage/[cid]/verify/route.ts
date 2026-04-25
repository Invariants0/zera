import { NextResponse } from 'next/server';

import { verifyCid } from '../../../../../server/storage/ipfsService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cid: string }> },
) {
  try {
    const { cid } = await params;
    const result = await verifyCid(cid);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'CID verification failed';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
