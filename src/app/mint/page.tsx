"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { UploadCloud, CheckCircle2, ArrowRight, ShieldAlert, Lock, Unlock, Loader2 } from "lucide-react";
import { useUpload } from "../../hooks/useUpload";
import { useWallet } from "../../hooks/useWallet";
import { registerAsset } from "../../services/contracts";

const steps = ["Upload Media", "Metadata", "Creator Auth", "Privacy", "Mint"];

const mintSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  category: z.string().optional(),
  royalty: z.number().min(0).max(20).optional(),
});

type MintFormData = z.infer<typeof mintSchema>;

export default function MintAsset() {
  const [currentStep, setCurrentStep] = useState(1);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedCID, setUploadedCID] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const { uploadFile, uploadMetadata, uploading, progress } = useUpload();
  const { isConnected, walletAddress, connectWallet } = useWallet();

  const { register, handleSubmit, formState: { errors } } = useForm<MintFormData>({
    resolver: zodResolver(mintSchema),
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Upload to IPFS
    const result = await uploadFile(file);
    if (result) {
      setUploadedCID(result.cid);
      toast.success('File uploaded to IPFS successfully');
    } else {
      toast.error('Failed to upload file');
    }
  };

  const handleMint = async (data: MintFormData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      await connectWallet();
      return;
    }

    if (!uploadedCID) {
      toast.error('Please upload a file first');
      setCurrentStep(1);
      return;
    }

    try {
      setIsMinting(true);

      // Create metadata
      const metadata = {
        name: data.title,
        description: data.description || '',
        image: `ipfs://${uploadedCID}`,
        attributes: {
          category: data.category || 'Uncategorized',
          royalty: data.royalty || 0,
          privacy: privacy,
        },
      };

      // Upload metadata to IPFS
      const metadataResult = await uploadMetadata(metadata);
      if (!metadataResult) {
        throw new Error('Failed to upload metadata');
      }

      // Register asset on-chain (stubbed)
      const result = await registerAsset({
        assetId: `asset-${Date.now()}`,
        metadataUri: `ipfs://${metadataResult.cid}`,
        creator: walletAddress!,
        isPrivate: privacy === 'private',
      });

      if (result.success) {
        toast.success('Asset minted successfully!');
        // Reset form
        setCurrentStep(1);
        setUploadedFile(null);
        setUploadedCID(null);
        setPreviewUrl(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint asset');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Mint Digital Asset
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2 max-w-xl">
          Create a new verified digital asset with optional Zero-Knowledge privacy wrappers.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-[1px] bg-lime -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-colors ${isActive ? 'bg-obsidian border-lime text-lime shadow-[0_0_20px_rgba(204,255,0,0.3)]' : isPast ? 'bg-lime border-lime text-black' : 'bg-obsidian border-white/20 text-text-muted'}`}>
                {isPast ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
              </div>
              <span className={`hidden md:block font-mono text-[10px] uppercase tracking-widest absolute -bottom-6 whitespace-nowrap ${isActive ? 'text-lime' : isPast ? 'text-text-primary' : 'text-text-muted'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(handleMint)}>
        <Card className="bg-obsidian border-white/10 p-8 md:p-12 mt-12">
          
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-grotesk font-bold mb-2">Upload Media</h2>
                <p className="text-text-secondary font-mono text-xs">Supported formats: JPG, PNG, GIF, MP4, WEBM. Max 50MB.</p>
              </div>

              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="w-full h-64 rounded-2xl border border-white/10 bg-black overflow-hidden">
                    {uploadedFile?.type.startsWith('video/') ? (
                      <video src={previewUrl} className="w-full h-full object-contain" controls />
                    ) : (
                      <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                    )}
                  </div>
                  {uploadedCID && (
                    <div className="flex items-center gap-2 text-sm font-mono text-lime">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Uploaded to IPFS: {uploadedCID.slice(0, 12)}...</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedCID(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="w-full h-64 rounded-2xl border-2 border-dashed border-white/20 bg-black/50 hover:bg-white/5 hover:border-lime/50 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-lime animate-spin" />
                      <p className="font-mono text-sm text-text-primary">
                        Uploading... {progress?.percentage || 0}%
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="font-mono text-sm text-text-primary">Drag and drop your file here</p>
                      <Button variant="secondary" className="h-8 text-[10px] bg-white/10 border-none pointer-events-none">Browse Files</Button>
                    </>
                  )}
                </label>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-grotesk font-bold mb-2">Asset Metadata</h2>
                <p className="text-text-secondary font-mono text-xs">Provide details about your digital asset.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-xs text-text-secondary mb-2">Title *</label>
                  <Input {...register("title")} placeholder="Enter asset title" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-secondary mb-2">Description</label>
                  <textarea
                    {...register("description")}
                    placeholder="Describe your asset..."
                    className="w-full h-32 rounded-lg border border-white/10 bg-obsidian_light px-3 py-2 text-sm text-primary transition-colors placeholder:text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-secondary mb-2">Category</label>
                  <select
                    {...register("category")}
                    className="w-full h-[44px] rounded-lg border border-white/10 bg-obsidian_light px-3 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
                  >
                    <option value="">Select category</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="membership">Membership</option>
                    <option value="license">IP License</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-secondary mb-2">Royalty % (0-20)</label>
                  <Input
                    {...register("royalty", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    placeholder="5"
                  />
                  {errors.royalty && <p className="text-red-500 text-xs mt-1">{errors.royalty.message}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 flex flex-col items-center justify-center py-12 text-center">
              <ShieldAlert className="w-12 h-12 text-lime mb-2" />
              <h2 className="text-2xl font-grotesk font-bold mb-2">Creator Authentication</h2>
              <p className="text-text-secondary font-mono text-xs max-w-sm">
                This step requires wallet signature to verify you as the creator. This is automatically handled when you mint.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-grotesk font-bold mb-2">Privacy Settings</h2>
                <p className="text-text-secondary font-mono text-xs">Configure how this asset's ownership is displayed on the public registry.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`p-6 rounded-2xl border text-left flex flex-col gap-4 transition-colors ${privacy === 'public' ? 'bg-white/5 border-white text-white' : 'bg-black border-white/10 text-text-secondary hover:border-white/30'}`}
                >
                  <Unlock className={`w-6 h-6 ${privacy === 'public' ? 'text-lime' : 'text-text-secondary'}`} />
                  <div>
                    <h3 className="font-grotesk font-bold text-lg mb-1">Public Ownership</h3>
                    <p className="font-mono text-[10px] leading-relaxed">Your wallet address will be visible on the public registry as the owner of this asset.</p>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setPrivacy('private')}
                  className={`p-6 rounded-2xl border text-left flex flex-col gap-4 transition-colors relative overflow-hidden ${privacy === 'private' ? 'bg-lime/5 border-lime text-lime' : 'bg-black border-white/10 text-text-secondary hover:border-white/30'}`}
                >
                  {privacy === 'private' && <div className="absolute top-0 right-0 px-3 py-1 bg-lime text-black font-mono text-[9px] font-bold tracking-widest rounded-bl-lg">RECOMMENDED</div>}
                  <Lock className={`w-6 h-6 ${privacy === 'private' ? 'text-lime' : 'text-text-secondary'}`} />
                  <div>
                    <h3 className="font-grotesk font-bold text-lg mb-1">Zero-Knowledge Privacy</h3>
                    <p className="font-mono text-[10px] leading-relaxed">Ownership is proven cryptographically but your wallet address remains completely hidden.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-lime mb-2" />
              <h2 className="text-2xl font-grotesk font-bold mb-2">Ready to Mint</h2>
              <p className="text-text-secondary font-mono text-xs max-w-sm">
                Review your asset details and click "Mint Asset" to create your digital asset on the blockchain.
              </p>
              {!isConnected && (
                <p className="text-yellow-500 font-mono text-xs">
                  ⚠️ Please connect your wallet to continue
                </p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between">
            <Button 
              type="button"
              variant="ghost" 
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Back
            </Button>
            {currentStep < 5 ? (
              <Button 
                type="button"
                variant="primary" 
                className="gap-2"
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
                disabled={currentStep === 1 && !uploadedCID}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit"
                variant="primary" 
                className="gap-2"
                disabled={isMinting || !isConnected}
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    Mint Asset <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
