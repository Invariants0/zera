import { NextResponse } from 'next/server';

import { uploadToIpfsService } from '../../../../server/storage/ipfsService';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'file is required' }, { status: 400 });
    }

    const privateFlag = formData.get('private');
    const isPrivate = privateFlag === 'true';

    const uploaded = await uploadToIpfsService(file, isPrivate);
    return NextResponse.json(uploaded, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
