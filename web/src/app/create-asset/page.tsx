"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileUp, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useWallet } from "../../hooks/useWallet";
import { encryptFileForIPFS, uploadMetadataToIPFS, uploadToIPFS } from "../../services/ipfs";
import { registerAsset } from "../../services/contracts";

export default function CreateAssetPage() {
  const { isConnected, walletAddress, connectWallet, walletApi } = useWallet();
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCid, setImageCid] = useState<string | null>(null);
  const [attachmentCid, setAttachmentCid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localProgress, setLocalProgress] = useState("Idle");
  const [successData, setSuccessData] = useState<{ txHash: string; assetId: string, name: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const imageLabel = useMemo(() => imageFile?.name ?? "Choose image", [imageFile]);
  const attachmentLabel = useMemo(() => attachmentFile?.name ?? "Choose file", [attachmentFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageCid(null);
  };

  const handleAttachmentSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAttachmentFile(file);
    setAttachmentCid(null);
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast.error("Connect your wallet first");
      await connectWallet();
      return;
    }

    if (!assetName.trim()) {
      toast.error("Add an asset name");
      return;
    }

    if (!imageFile) {
      toast.error("Upload an image first");
      return;
    }

    if (!walletApi) {
      toast.error("Wallet is not ready yet");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image WITHOUT encryption (public display)
      let imageUploadCid: string | null = null;
      if (imageFile) {
        setLocalProgress("Uploading image...");
        const imageUpload = await uploadToIPFS(imageFile);
        imageUploadCid = imageUpload.cid;
        setImageCid(imageUpload.cid);
      }

      // Encrypt and upload file (private content)
      const encryptedAttachmentFile = attachmentFile ? await encryptFileForIPFS(attachmentFile) : null;
      let encryptedAttachmentUploadCid: string | null = null;

      if (encryptedAttachmentFile) {
        setLocalProgress("Uploading encrypted file...");
        const fileUpload = await uploadToIPFS(encryptedAttachmentFile.file);
        encryptedAttachmentUploadCid = fileUpload.cid;
        setAttachmentCid(fileUpload.cid);
      }

      const metadata = {
        name: assetName.trim(),
        description: description.trim(),
        image: imageUploadCid ? `ipfs://${imageUploadCid}` : null,
        file: encryptedAttachmentUploadCid ? `ipfs://${encryptedAttachmentUploadCid}` : null,
        encryption: {
          // Image is NOT encrypted
          image: null,
          // Only file is encrypted
          file: encryptedAttachmentFile
            ? {
                algorithm: encryptedAttachmentFile.algorithm,
                key: encryptedAttachmentFile.key,
                iv: encryptedAttachmentFile.iv,
                originalName: encryptedAttachmentFile.originalName,
                originalType: encryptedAttachmentFile.originalType,
              }
            : null,
        },
        network: walletApi ? "midnight" : "unknown",
        creator: walletAddress,
      };

      setLocalProgress("Uploading metadata...");
      const metadataUpload = await uploadMetadataToIPFS(metadata);
      setLocalProgress("Registering on Midnight...");
      const minted = await registerAsset({
        assetId: `asset-${Date.now()}`,
        metadataUri: `ipfs://${metadataUpload.cid}`,
        creator: walletAddress!,
        isPrivate: true,
        name: assetName.trim(),
        description: description.trim(),
        imageUrl: imageUploadCid ? `https://ipfs.io/ipfs/${imageUploadCid}` : undefined,
      });

      if (!minted.success) {
        throw new Error(minted.message);
      }

      setSuccessData({
        txHash: minted.transactionHash || "Unknown",
        assetId: minted.data?.assetId || "Unknown",
        name: assetName.trim()
      });

      toast.success(`Asset "${assetName.trim()}" created successfully!`);
      // We purposefully DO NOT reset the form here so the user can see the success card!
      setLocalProgress("Done");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to create asset";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Create Asset
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Upload a public image and optional encrypted file. Files are stored on IPFS and can be downloaded after purchase.
        </p>
      </div>

      <Card className="bg-obsidian border-white/10 p-6 md:p-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Name *</label>
              <Input value={assetName} onChange={(event) => setAssetName(event.target.value)} placeholder="Example: Neon Nexus" className="h-12 bg-black border-white/10 text-lg" />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full rounded-xl bg-black border border-white/10 p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-lime resize-none"
                placeholder="Describe your asset..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase text-text-secondary">Image *</label>
              <input id="asset-image" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <label htmlFor="asset-image" className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black hover:border-lime/50 hover:bg-white/5 transition-colors">
                <ImageIcon className="w-8 h-8 text-text-secondary mb-3" />
                <span className="font-mono text-sm text-text-primary">{imageLabel}</span>
                <span className="font-mono text-[10px] text-text-muted mt-2">Public preview (not encrypted)</span>
              </label>
              {imagePreview ? (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              ) : null}
              {imageCid ? <p className="font-mono text-[10px] text-lime">Image CID: {imageCid}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase text-text-secondary">File</label>
              <input id="asset-file" type="file" className="hidden" onChange={handleAttachmentSelect} />
              <label htmlFor="asset-file" className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black hover:border-lime/50 hover:bg-white/5 transition-colors">
                <FileUp className="w-8 h-8 text-text-secondary mb-3" />
                <span className="font-mono text-sm text-text-primary">{attachmentLabel}</span>
                <span className="font-mono text-[10px] text-text-muted mt-2">Encrypted before IPFS upload</span>
              </label>
              {attachmentCid ? <p className="font-mono text-[10px] text-lime">File CID: {attachmentCid}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Storage and transaction</p>
            <p className="font-mono text-sm text-text-primary mt-2">
              Images are uploaded publicly to IPFS for display. Files are encrypted locally before upload and can only be decrypted after purchase with tNight tokens.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
          {(isSubmitting || imageCid || attachmentCid) ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-black/30 px-4 py-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
              {isSubmitting ? (
                <>
                  <p className="font-mono text-[11px] text-text-primary flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-lime" />
                    {localProgress}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 rounded-full bg-lime/90 animate-pulse" />
                  </div>
                </>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] ${imageCid ? "border-lime/40 text-lime bg-lime/10" : "border-white/15 text-text-secondary bg-white/5"}`}>
                  {imageCid ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                  {imageCid ? "Image uploaded" : "Image pending"}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] ${attachmentCid ? "border-lime/40 text-lime bg-lime/10" : "border-white/15 text-text-secondary bg-white/5"}`}>
                  {attachmentCid ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                  {attachmentCid ? "File uploaded" : "File pending"}
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-4">
            {successData && (
              <Button variant="secondary" className="h-12 px-8" onClick={() => {
                setSuccessData(null);
                setAssetName("");
                setDescription("");
                setImageFile(null);
                setAttachmentFile(null);
                setImagePreview(null);
                setImageCid(null);
                setAttachmentCid(null);
              }}>
                Mint Another
              </Button>
            )}
            <Button variant="primary" className="h-12 px-8 gap-2" onClick={handleSubmit} disabled={isSubmitting || !!successData}>
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? "Creating..." : successData ? "Asset Created" : "Create Asset"}
            </Button>
          </div>
        </div>
      </Card>

      {successData && (
        <Card className="mt-8 bg-lime/5 border-lime/20 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center">
               <CheckCircle2 className="w-6 h-6 text-lime" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-xl font-grotesk font-bold text-lime uppercase tracking-tight">Asset Created: {successData.name}</h3>
               <p className="mt-1 text-sm font-mono text-text-secondary">
                 Your asset was registered to the Midnight network. Because Midnight uses ZK-SNARKs, the network mathematically verified your ownership without ever exposing your private keys!
               </p>
               
               <div className="mt-6 space-y-4">
                 <div className="rounded-xl border border-lime/10 bg-black/40 p-4">
                   <p className="text-[10px] font-mono uppercase text-lime/70">Transaction Hash</p>
                   <p className="mt-1 text-sm font-mono text-text-primary break-all">{successData.txHash}</p>
                 </div>
                 <div className="rounded-xl border border-lime/10 bg-black/40 p-4">
                   <p className="text-[10px] font-mono uppercase text-lime/70">Zera Asset ID</p>
                   <p className="mt-1 text-sm font-mono text-text-primary break-all">{successData.assetId}</p>
                 </div>
               </div>

               <div className="mt-6 flex flex-wrap gap-4">
                 <a 
                   href={`https://testnet.explorer.midnight.network/transactions/${successData.txHash}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                 >
                   <Button variant="secondary" className="border-lime/30 text-lime hover:bg-lime/10 h-10">
                     View on Explorer
                   </Button>
                 </a>
               </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
