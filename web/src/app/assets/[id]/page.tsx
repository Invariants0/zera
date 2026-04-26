"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Heart, CheckCircle2, ArrowRightLeft, ExternalLink, Shield, ShieldCheck, Lock, Download, ShoppingCart } from "lucide-react";
import { useWallet } from "../../../hooks/useWallet";
import { Loading } from "../../../components/ui/Loading";
import { EmptyState } from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";
import Link from "next/link";
import { getFromIPFS, decryptIPFSBlob } from "../../../services/ipfs";
import { TransferModal } from "../../../components/TransferModal";

type Asset = {
  id: string; title: string; description?: string; creator: string; owner: string;
  price: string; imageUrl: string; metadataUri: string; badges: string[];
  verified: boolean; private: boolean; createdAt: string; updatedAt: string;
};

type AssetMetadata = {
  name: string;
  description: string;
  image: string | null;
  file: string | null;
  encryption: {
    image: null;
    file: {
      algorithm: string;
      key: string;
      iv: string;
      originalName: string;
      originalType: string;
    } | null;
  };
  creator: string;
};

export default function AssetDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { walletAddress, isConnected, walletApi } = useWallet();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlisted, setWatchlisted] = useState(false);
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [ownershipStatus, setOwnershipStatus] = useState<{
    ownershipExists: boolean;
    verified: boolean | null;
    commitment: string | null;
  } | null>(null);


  const loadAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${id}`);
      const assetData = await response.json();
      setAsset(assetData);

      // Fetch metadata from IPFS
      if (assetData.metadataUri && assetData.metadataUri.startsWith('ipfs://')) {
        const cid = assetData.metadataUri.replace('ipfs://', '');
        try {
          const metadataBlob = await getFromIPFS(cid);
          const metadataText = await metadataBlob.text();
          const metadataJson = JSON.parse(metadataText);
          setMetadata(metadataJson);
        } catch (ipfsError) {
          console.error('IPFS fetch failed:', ipfsError);
        }
      }

      // Check if user has purchased this asset
      if (walletAddress) {
        const purchaseResponse = await fetch(`/api/purchases?userId=${walletAddress}&assetId=${id}`);
        if (purchaseResponse.ok) {
          const purchaseData = await purchaseResponse.json();
          setHasPurchased(purchaseData.hasPurchased || false);
        }

        // Check if user has watchlisted this asset
        const watchlistResponse = await fetch(`/api/watchlist?userId=${encodeURIComponent(walletAddress)}`);
        if (watchlistResponse.ok) {
          const watchlistData = await watchlistResponse.json();
          const isWatchlisted = watchlistData.some((w: any) => w.id === id);
          setWatchlisted(isWatchlisted);
        }

        // Check on-chain ownership status
        const ownershipRes = await fetch('/api/proofs/ownership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetId: id, owner: walletAddress }),
        });
        if (ownershipRes.ok) {
          const ownershipData = await ownershipRes.json();
          setOwnershipStatus({
            ownershipExists: ownershipData.data?.ownershipExists || false,
            verified: ownershipData.data?.verified || false,
            commitment: ownershipData.data?.commitment || null
          });
        }
      }

    } catch (error) {
      console.error('Failed to load asset:', error);
      setAsset(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsset();
  }, [id, walletAddress]);

  const toggleWatchlist = async () => {
    if (!walletAddress) { toast.error('Connect wallet first'); return; }
    if (watchlisted) {
      await fetch(`/api/watchlist?userId=${encodeURIComponent(walletAddress)}&assetId=${id}`, { method: 'DELETE' });
      setWatchlisted(false);
      toast.success('Removed from watchlist');
    } else {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: walletAddress, assetId: id }),
      });
      if (res.ok) { setWatchlisted(true); toast.success('Added to watchlist'); }
      else { toast.error('Already in watchlist or error'); }
    }
  };

  const verifyOwnership = async () => {
    if (!walletAddress) { toast.error('Connect wallet first'); return; }
    
    if (ownershipStatus && !ownershipStatus.ownershipExists) {
      toast.error('On-chain ownership record missing. Please claim ownership first.');
      return;
    }

    const tid = toast.loading('Verifying ownership on Midnight...');
    try {
      const res = await fetch('/api/proofs/ownership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: id, owner: walletAddress }),
      });
      const data = await res.json();
      if (data.success && data.data?.verified) {
        toast.success(`Ownership verified! Proof ID: ${data.data.proofId}`, { id: tid });
        setOwnershipStatus({ 
          ownershipExists: true, 
          verified: true,
          commitment: data.data.commitment
        });
      } else {
        toast.error('Ownership could not be verified', { id: tid });
      }
    } catch { toast.error('Verification failed', { id: tid }); }
  };

  const handleClaimOwnership = async () => {
    if (!walletAddress) { toast.error('Connect wallet first'); return; }
    const tid = toast.loading('Claiming ownership on-chain...');
    setIsClaiming(true);
    try {
      const res = await fetch(`/api/assets/${id}/claim`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Ownership claimed! Finalizing registry sync...', { id: tid });
        // Give indexer a moment to catch up
        setTimeout(() => {
          loadAsset();
          toast.success('Sync complete. You can now verify or transfer.', { id: tid });
        }, 2000);
      } else {
        toast.error(data.message || 'Claim failed', { id: tid });
      }
    } catch { toast.error('Claim failed', { id: tid }); }
    finally { setIsClaiming(false); }
  };


  const handlePurchase = async () => {
    // Enhanced validation with better error messages
    if (!isConnected || !walletAddress) {
      toast.error('Please connect your Lace wallet first');
      console.error('[Purchase] Wallet not connected:', { isConnected, walletAddress });
      return;
    }

    if (!walletApi) {
      toast.error('Wallet API not ready. Try disconnecting and reconnecting your wallet.');
      console.error('[Purchase] Wallet API not available. Check network configuration.');
      console.error('[Purchase] Expected network: preprod, Current walletApi:', walletApi);
      return;
    }

    if (!asset) {
      console.error('[Purchase] Asset not loaded');
      return;
    }

    // Log purchase attempt for debugging
    console.log('[Purchase] Starting purchase flow:', {
      assetId: asset.id,
      assetTitle: asset.title,
      price: asset.price,
      seller: asset.owner,
      buyer: walletAddress,
      isConnected,
      hasWalletApi: !!walletApi,
    });

    setIsPurchasing(true);
    const tid = toast.loading('Initiating Lace payment...');

    try {
      // 1. Parse price and handle actual NIGHT transfer
      let priceBaseUnits = 0n;
      const priceMatch = asset.price.match(/(\d+(\.\d+)?)\s*(tNIGHT|NIGHT|tDUST|ZERA)?/i);
      if (priceMatch) {
        const amount = parseFloat(priceMatch[1]);
        const unit = (priceMatch[3] || 'tNIGHT').toUpperCase();
        
        if (unit.includes('NIGHT') || unit === 'ZERA') {
          priceBaseUnits = BigInt(Math.floor(amount * 1_000_000));
        } else {
          // Assume tDUST or unknown unit uses 1:1 for now
          priceBaseUnits = BigInt(Math.floor(amount));
        }
      }

      console.log(`[Lace Payment] Asset: ${asset.title}, Price: ${asset.price}, Base Units: ${priceBaseUnits}`);

      // Only perform transfer if price > 0
      if (priceBaseUnits > 0n) {
        toast.loading('Please approve the transfer in Lace wallet popup...', { id: tid });
        
        try {
          const transferResult = await (walletApi as any).makeTransfer({
            shieldedReceivers: [
              {
                address: asset.owner,
                amount: priceBaseUnits,
              }
            ],
            unshieldedReceivers: [],
          });

          console.log('[Lace Payment] Transfer successful:', transferResult);
          toast.loading('Payment confirmed. Updating registry...', { id: tid });
        } catch (transferError) {
          console.error('[Lace Payment] Transfer failed:', transferError);
          throw new Error(
            transferError instanceof Error 
              ? `Payment failed: ${transferError.message}` 
              : 'Payment was cancelled or failed'
          );
        }
      } else {
        toast.loading('Processing free asset...', { id: tid });
      }

      // 2. Transfer ownership via Midnight contract
      const transferResponse = await fetch(`/api/assets/${id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: asset.owner,
          to: walletAddress,
          price: asset.price,
        }),
      });

      const transferData = await transferResponse.json();

      if (!transferData.success) {
        throw new Error(transferData.message || 'Registry update failed');
      }

      // 3. Record purchase in database
      await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: walletAddress,
          assetId: id,
          price: asset.price,
          txHash: transferData.transactionHash,
        }),
      });

      setHasPurchased(true);
      toast.success('Purchase successful! Ownership transferred.', { id: tid });

      // Refresh asset data
      loadAsset();
    } catch (error) {
      console.error('[Purchase Error]', error);
      const message = error instanceof Error ? error.message : 'Purchase failed';
      toast.error(message, { id: tid });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata?.file || !metadata.encryption.file) {
      toast.error('No downloadable file available');
      return;
    }

    if (!hasPurchased && !isOwner) {
      toast.error('You must purchase this asset first');
      return;
    }

    setIsDownloading(true);
    const tid = toast.loading('Downloading and decrypting file...');

    try {
      const fileCid = metadata.file.replace('ipfs://', '');
      const encryptedBlob = await getFromIPFS(fileCid);

      const decryptedBlob = await decryptIPFSBlob(
        encryptedBlob,
        metadata.encryption.file.key,
        metadata.encryption.file.iv
      );

      // Create download link
      const url = URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = metadata.encryption.file.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!', { id: tid });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file', { id: tid });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="p-10"><Loading text="Loading asset..." /></div>;
  if (!asset) return <div className="p-10"><EmptyState icon={Shield} title="Asset Not Found" description="This asset does not exist in the registry." /></div>;

  const isOwner = walletAddress && asset.owner === walletAddress;
  const isCreator = walletAddress && asset.creator === walletAddress;

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-8">
        <Link href="/explore" className="font-mono text-xs text-text-muted hover:text-lime transition-colors">← Back to Explore</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Image */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-square relative bg-black">
            <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {asset.verified && <Badge variant="verified" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-1 text-[10px]">VERIFIED</Badge>}
              {asset.private && <Badge variant="private" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-1 text-[10px]">PRIVATE</Badge>}
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight">{asset.title}</h1>
            {asset.description && <p className="font-mono text-sm text-text-secondary mt-3">{asset.description}</p>}
          </div>

          <Card className="bg-obsidian border-white/10 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Asset ID</span>
              <span className="font-mono text-xs text-text-primary">{asset.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Creator</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-glow" />
                <span className="font-mono text-xs text-lime">ZK-Verified</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Owner</span>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-xs text-text-primary">
                  {isOwner ? 'You (Sovereign Owner)' : 'ZK-Verified'}
                </span>
                {ownershipStatus?.commitment && (
                  <span className="font-mono text-[8px] text-text-muted">
                    ID: {ownershipStatus.commitment.slice(0, 16)}...
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Price</span>
              <span className="font-mono text-sm font-bold text-lime">{asset.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Metadata</span>
              {asset.metadataUri.startsWith('ipfs://') ? (
                <a href={asset.metadataUri.replace('ipfs://', 'http://localhost:8080/fetch/')}
                  target="_blank" rel="noopener noreferrer"
                  className="font-mono text-xs text-lime hover:underline flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="font-mono text-[9px] text-text-muted truncate max-w-[150px]">
                  {asset.metadataUri}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Created</span>
              <span className="font-mono text-xs text-text-secondary">{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            {!isOwner && !hasPurchased && (
              <Button 
                variant="primary" 
                className="h-12 gap-2" 
                onClick={handlePurchase}
                disabled={isPurchasing}
              >
                <ShoppingCart className="w-4 h-4" /> 
                {isPurchasing ? 'Processing...' : `Purchase for ${asset.price} tNight`}
              </Button>
            )}

            {(isOwner || isCreator) && ownershipStatus && !ownershipStatus.ownershipExists && (
              <Button 
                variant="primary" 
                className="h-12 gap-2 bg-lime text-black hover:bg-lime/90" 
                onClick={handleClaimOwnership}
                disabled={isClaiming}
              >
                <ShieldCheck className="w-4 h-4" /> 
                {isClaiming ? 'Claiming...' : 'Claim On-Chain Ownership'}
              </Button>
            )}


            {(ownershipStatus?.verified || isOwner) && metadata?.file && (
              <Button 
                variant="primary" 
                className="h-12 gap-2" 
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" /> 
                {isDownloading ? 'Downloading...' : 'Download Asset File'}
              </Button>
            )}

            <Button variant="secondary" className="h-12 gap-2 border-white/10" onClick={verifyOwnership}>
              <Shield className="w-4 h-4" /> Verify Ownership (ZK Proof)
            </Button>

            {isOwner && (
              <div className="flex flex-col gap-3">
                <Button 
                  variant="secondary" 
                  className="h-12 gap-2 w-full border-white/10"
                  onClick={() => setIsTransferModalOpen(true)}
                >
                  <ArrowRightLeft className="w-4 h-4" /> Transfer Ownership
                </Button>
                <Button 
                  variant="secondary" 
                  className="h-12 gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this asset? This will remove it from the Zera registry (local database).')) {
                      const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
                      if (res.ok) {
                        toast.success('Asset deleted successfully');
                        window.location.href = '/explore';
                      } else {
                        toast.error('Failed to delete asset');
                      }
                    }
                  }}
                >
                  <Lock className="w-4 h-4" /> Delete Asset (Registry)
                </Button>
              </div>
            )}


            <Button variant="secondary" className={`h-12 gap-2 border-white/10 ${watchlisted ? 'border-red-500/40 text-red-400' : ''}`} onClick={toggleWatchlist}>
              <Heart className={`w-4 h-4 ${watchlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>
      </div>

      {isTransferModalOpen && asset && (
        <TransferModal 
          assetId={asset.id}
          assetTitle={asset.title}
          currentOwner={asset.owner}
          onClose={() => setIsTransferModalOpen(false)}
          onSuccess={() => {
            loadAsset();
          }}
        />
      )}
    </div>
  );
}
