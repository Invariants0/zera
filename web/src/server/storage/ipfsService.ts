// IPFS_SERVICE_URL should point to the Rust IPFS microservice (storage/ipfs).
// NEXT_PUBLIC_IPFS_API_URL — set them to the same host:port in your .env.
const DEFAULT_IPFS_SERVICE_URL = process.env.IPFS_SERVICE_URL ?? 'http://localhost:8080';

type UploadResult = {
  cid: string;
  url: string;
  size: number;
};

async function assertOkResponse(response: Response, fallback: string) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || fallback);
  }
}

export async function uploadToIpfsService(file: File, isPrivate: boolean): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);

  const response = await fetch(`${DEFAULT_IPFS_SERVICE_URL}/upload?private=${isPrivate}`, {
    method: 'POST',
    body: form,
  });

  await assertOkResponse(response, 'Failed to upload to IPFS service');

  const payload = (await response.json()) as {
    success: boolean;
    cid?: string;
    gateway?: string;
    error?: string;
  };

  if (!payload.success || !payload.cid) {
    throw new Error(payload.error || 'IPFS upload failed');
  }

  return {
    cid: payload.cid,
    url: payload.gateway ?? `${DEFAULT_IPFS_SERVICE_URL}/fetch/${payload.cid}`,
    size: file.size,
  };
}

export async function fetchByCid(cid: string) {
  const response = await fetch(`${DEFAULT_IPFS_SERVICE_URL}/fetch/${cid}`);
  await assertOkResponse(response, 'Failed to fetch CID');
  return (await response.json()) as {
    success: boolean;
    path?: string;
    error?: string;
  };
}

export async function verifyCid(cid: string) {
  const response = await fetch(`${DEFAULT_IPFS_SERVICE_URL}/verify/${cid}`);
  await assertOkResponse(response, 'Failed to verify CID');
  return (await response.json()) as {
    success: boolean;
    reachable?: boolean;
    error?: string;
  };
}
