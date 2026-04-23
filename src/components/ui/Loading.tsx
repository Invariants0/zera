import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const Loading = ({ size = "md", text }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className={`${sizeClasses[size]} text-lime animate-spin`} />
      {text && (
        <p className="font-mono text-sm text-text-secondary">{text}</p>
      )}
    </div>
  );
};

export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-0 overflow-hidden bg-obsidian border border-white/5 rounded-2xl">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <div className="pt-4 flex justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};
