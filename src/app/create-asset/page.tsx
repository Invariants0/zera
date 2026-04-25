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
      const encryptedImageFile = imageFile ? await encryptFileForIPFS(imageFile) : null;
      const encryptedAttachmentFile = attachmentFile ? await encryptFileForIPFS(attachmentFile) : null;

      let encryptedImageUploadCid: string | null = null;
      let encryptedAttachmentUploadCid: string | null = null;

      if (encryptedImageFile) {
        setLocalProgress("Uploading encrypted image...");
        const imageUpload = await uploadToIPFS(encryptedImageFile.file);
        encryptedImageUploadCid = imageUpload.cid;
        setImageCid(imageUpload.cid);
      }

      if (encryptedAttachmentFile) {
        setLocalProgress("Uploading encrypted file...");
        const fileUpload = await uploadToIPFS(encryptedAttachmentFile.file);
        encryptedAttachmentUploadCid = fileUpload.cid;
        setAttachmentCid(fileUpload.cid);
      }

      const metadata = {
        name: assetName.trim(),
        description: description.trim(),
        image: encryptedImageUploadCid ? `ipfs://${encryptedImageUploadCid}` : null,
        file: encryptedAttachmentUploadCid ? `ipfs://${encryptedAttachmentUploadCid}` : null,
        encryption: {
          image: encryptedImageFile
            ? {
                algorithm: encryptedImageFile.algorithm,
                key: encryptedImageFile.key,
                iv: encryptedImageFile.iv,
                originalName: encryptedImageFile.originalName,
                originalType: encryptedImageFile.originalType,
              }
            : null,
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
      });

      if (!minted.success) {
        throw new Error(minted.message);
      }

      toast.success("Asset created successfully");
      setAssetName("");
      setDescription("");
      setImageFile(null);
      setAttachmentFile(null);
      setImagePreview(null);
      setImageCid(null);
      setAttachmentCid(null);
      setLocalProgress("Done");

      if (walletApi) {
        await walletApi.hintUsage(["makeTransfer", "submitTransaction"]);
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to create asset";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Create Asset
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Upload an encrypted image and optional file. Everything is stored in IPFS.
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
                <span className="font-mono text-[10px] text-text-muted mt-2">Encrypted before IPFS upload</span>
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
              Files are encrypted locally, uploaded to IPFS, then registered with the connected Midnight wallet.
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

          <div className="flex justify-end">
          <Button variant="primary" className="h-12 px-8 gap-2" onClick={handleSubmit} disabled={isSubmitting}>
            <UploadCloud className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create Asset"}
          </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
